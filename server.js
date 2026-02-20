const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Game state
const rooms = new Map();
const players = new Map();

// Room management functions
function createRoom(id, name, maxPlayers = 4, difficulty = 'Medium') {
  const room = {
    id,
    name,
    players: [],
    maxPlayers,
    difficulty,
    status: 'Waiting', // 'Waiting', 'In Progress', 'Finished'
    text: "Speed through the winding course of letters. Navigate the challenging turns of punctuation and acceleration zones of common words. Cross the finish line first by maintaining both speed and accuracy.",
    startTime: null,
    isStarted: false,
    countdown: 0
  };
  rooms.set(id, room);
  return room;
}

function addPlayerToRoom(playerId, roomId, playerData) {
  const room = rooms.get(roomId);
  if (!room || room.players.length >= room.maxPlayers) {
    return null;
  }

  const player = {
    id: playerId,
    name: playerData.name || `Player ${room.players.length + 1}`,
    avatar: playerData.avatar || '🎯',
    position: room.players.length + 1,
    wpm: 0,
    accuracy: 100,
    progress: 0,
    isFinished: false,
    isReady: false
  };

  room.players.push(player);
  players.set(playerId, { ...player, roomId });

  // Update room status
  if (room.players.length >= 2 && room.status === 'Waiting') {
    room.status = 'Waiting'; // Keep waiting until all players are ready
  }

  return { room, player };
}

function removePlayerFromRoom(playerId) {
  const player = players.get(playerId);
  if (!player) return null;

  const room = rooms.get(player.roomId);
  if (!room) return null;

  // Remove player from room
  room.players = room.players.filter(p => p.id !== playerId);
  players.delete(playerId);

  // Update positions
  room.players.forEach((p, index) => {
    p.position = index + 1;
  });

  // If room is empty, delete it
  if (room.players.length === 0) {
    rooms.delete(room.id);
    return null;
  }

  // If in progress and only one player left, end the race
  if (room.status === 'In Progress' && room.players.length === 1) {
    room.status = 'Finished';
  }

  return room;
}

function updatePlayerProgress(playerId, progress, wpm, accuracy) {
  const player = players.get(playerId);
  if (!player) return null;

  const room = rooms.get(player.roomId);
  if (!room) return null;

  // Update player data in both maps
  const updatedPlayer = {
    ...player,
    progress: Math.min(100, progress),
    wpm,
    accuracy,
    isFinished: progress >= 100
  };

  players.set(playerId, updatedPlayer);

  // Update player in room
  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex !== -1) {
    room.players[playerIndex] = { ...updatedPlayer };
  }

  // Update positions based on progress
  room.players.sort((a, b) => b.progress - a.progress);
  room.players.forEach((p, index) => {
    p.position = index + 1;
    // Update the main players map too
    const mainPlayer = players.get(p.id);
    if (mainPlayer) {
      mainPlayer.position = index + 1;
      players.set(p.id, mainPlayer);
    }
  });

  // Check if race is finished
  if (room.status === 'In Progress' && room.players.some(p => p.isFinished)) {
    const finishedPlayers = room.players.filter(p => p.isFinished).length;
    if (finishedPlayers >= room.players.length - 1) {
      // Race is finished when all but one player is done, or all are done
      room.status = 'Finished';
    }
  }

  return { room, player: updatedPlayer };
}

// Create some default rooms
createRoom('room1', 'Speed Demons Only', 4, 'Hard');
createRoom('room2', 'Beginner Friendly', 6, 'Easy');
createRoom('room3', 'Quick Race', 3, 'Medium');
createRoom('room4', 'Late Night Session', 5, 'Medium');

nextApp.prepare().then(() => {
  const server = createServer();
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Handle Next.js requests
  server.on('request', (req, res) => {
    nextHandler(req, res);
  });

  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Send available rooms
    socket.emit('rooms:list', Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      players: room.players.length,
      maxPlayers: room.maxPlayers,
      difficulty: room.difficulty,
      status: room.status
    })));

    // Join room
    socket.on('room:join', (data) => {
      const { roomId, playerData } = data;
      const result = addPlayerToRoom(socket.id, roomId, playerData || {});

      if (result) {
        socket.join(roomId);
        socket.emit('room:joined', {
          room: result.room,
          player: result.player
        });

        // Broadcast to all players in room
        io.to(roomId).emit('room:updated', result.room);

        // Update room list for all clients
        io.emit('rooms:list', Array.from(rooms.values()).map(room => ({
          id: room.id,
          name: room.name,
          players: room.players.length,
          maxPlayers: room.maxPlayers,
          difficulty: room.difficulty,
          status: room.status
        })));
      } else {
        socket.emit('room:join:failed', { message: 'Room is full or does not exist' });
      }
    });

    // Create room
    socket.on('room:create', (data) => {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const room = createRoom(roomId, data.name, data.maxPlayers, data.difficulty);

      const result = addPlayerToRoom(socket.id, roomId, data.playerData || {});
      if (result) {
        socket.join(roomId);
        socket.emit('room:created', {
          room: result.room,
          player: result.player
        });

        // Update room list for all clients
        io.emit('rooms:list', Array.from(rooms.values()).map(room => ({
          id: room.id,
          name: room.name,
          players: room.players.length,
          maxPlayers: room.maxPlayers,
          difficulty: room.difficulty,
          status: room.status
        })));
      }
    });

    // Player ready
    socket.on('player:ready', () => {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Mark player as ready
      const roomPlayer = room.players.find(p => p.id === socket.id);
      if (roomPlayer) {
        roomPlayer.isReady = true;
        player.isReady = true;
        players.set(socket.id, player);
      }

      // Check if all players are ready
      const allReady = room.players.length >= 2 && room.players.every(p => p.isReady);
      if (allReady && room.status === 'Waiting') {
        // Start countdown
        room.countdown = 3;
        room.status = 'In Progress';
        io.to(player.roomId).emit('race:countdown', { countdown: 3 });

        const countdownInterval = setInterval(() => {
          room.countdown--;
          if (room.countdown > 0) {
            io.to(player.roomId).emit('race:countdown', { countdown: room.countdown });
          } else {
            clearInterval(countdownInterval);
            room.startTime = Date.now();
            room.isStarted = true;
            io.to(player.roomId).emit('race:start', { room });
          }
        }, 1000);
      }

      io.to(player.roomId).emit('room:updated', room);
    });

    // Update progress
    socket.on('player:progress', (data) => {
      const { progress, wpm, accuracy } = data;
      const result = updatePlayerProgress(socket.id, progress, wpm, accuracy);

      if (result) {
        // Send to all players in room
        io.to(result.player.roomId).emit('room:updated', result.room);

        // If race finished, send race results
        if (result.room.status === 'Finished') {
          io.to(result.player.roomId).emit('race:finished', {
            room: result.room,
            winner: result.room.players[0] // First player (highest progress)
          });
        }
      }
    });

    // Emotes
    socket.on('player:emote', (data) => {
      const player = players.get(socket.id);
      if (!player) return;

      const { emoji } = data;
      // Broadcast to everyone in the room (including sender)
      io.to(player.roomId).emit('room:emote', {
        playerId: socket.id,
        emoji
      });
    });

    // Leave room
    socket.on('room:leave', () => {
      const player = players.get(socket.id);
      if (!player) return;

      socket.leave(player.roomId);
      const room = removePlayerFromRoom(socket.id);

      if (room) {
        io.to(player.roomId).emit('room:updated', room);
      }

      // Update room list for all clients
      io.emit('rooms:list', Array.from(rooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        players: room.players.length,
        maxPlayers: room.maxPlayers,
        difficulty: room.difficulty,
        status: room.status
      })));
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);

      const player = players.get(socket.id);
      if (player) {
        const room = removePlayerFromRoom(socket.id);

        if (room) {
          io.to(player.roomId).emit('room:updated', room);
        }

        // Update room list for all clients
        io.emit('rooms:list', Array.from(rooms.values()).map(room => ({
          id: room.id,
          name: room.name,
          players: room.players.length,
          maxPlayers: room.maxPlayers,
          difficulty: room.difficulty,
          status: room.status
        })));
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Server running on http://localhost:${PORT}`);
  });
});