'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRaceStore, Player, RaceRoom } from '@/store/raceStore';

interface SocketEvents {
  'rooms:list': (rooms: any[]) => void;
  'room:joined': (data: { room: RaceRoom; player: Player }) => void;
  'room:created': (data: { room: RaceRoom; player: Player }) => void;
  'room:updated': (room: RaceRoom) => void;
  'room:join:failed': (data: { message: string }) => void;
  'race:countdown': (data: { countdown: number }) => void;
  'race:start': (data: { room: RaceRoom }) => void;
  'race:finished': (data: { room: RaceRoom; winner: Player }) => void;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { 
    setCurrentRoom, 
    setAvailableRooms, 
    setCurrentPlayer, 
    setIsConnected: setStoreConnected,
    currentRoom,
    currentPlayer 
  } = useRaceStore();

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setStoreConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setStoreConnected(false);
    });

    // Room events
    socket.on('rooms:list', (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on('room:joined', (data) => {
      setCurrentRoom(data.room);
      setCurrentPlayer(data.player);
    });

    socket.on('room:created', (data) => {
      setCurrentRoom(data.room);
      setCurrentPlayer(data.player);
    });

    socket.on('room:updated', (room) => {
      setCurrentRoom(room);
    });

    socket.on('room:join:failed', (data) => {
      console.error('Failed to join room:', data.message);
      alert(`Failed to join room: ${data.message}`);
    });

    // Race events
    socket.on('race:countdown', (data) => {
      // Countdown will be handled by the MultiplayerRace component
      console.log('Race countdown:', data.countdown);
    });

    socket.on('race:start', (data) => {
      console.log('Race started!');
      setCurrentRoom(data.room);
    });

    socket.on('race:finished', (data) => {
      console.log('Race finished!', data);
      setCurrentRoom(data.room);
    });

    return () => {
      socket.disconnect();
    };
  }, [setCurrentRoom, setAvailableRooms, setCurrentPlayer, setStoreConnected]);

  const joinRoom = (roomId: string, playerData?: { name?: string; avatar?: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('room:join', {
        roomId,
        playerData: playerData || {}
      });
    }
  };

  const createRoom = (roomData: {
    name: string;
    maxPlayers: number;
    difficulty: string;
    playerData?: { name?: string; avatar?: string };
  }) => {
    if (socketRef.current) {
      socketRef.current.emit('room:create', roomData);
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('room:leave');
      setCurrentRoom(null);
      setCurrentPlayer(null);
    }
  };

  const markReady = () => {
    if (socketRef.current) {
      socketRef.current.emit('player:ready');
    }
  };

  const updateProgress = (progress: number, wpm: number, accuracy: number) => {
    if (socketRef.current && currentPlayer) {
      socketRef.current.emit('player:progress', {
        progress,
        wpm,
        accuracy
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    createRoom,
    leaveRoom,
    markReady,
    updateProgress
  };
};