'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useRaceStore } from '@/store/raceStore';

interface Room {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Waiting' | 'In Progress' | 'Finished';
}

interface RoomSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onJoinRace: () => void;
}

export default function RoomSelector({ isVisible, onClose, onJoinRace }: RoomSelectorProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  
  const { joinRoom, createRoom, isConnected } = useSocket();
  const { availableRooms } = useRaceStore();

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting': return 'text-green-400';
      case 'In Progress': return 'text-yellow-400';
      case 'Finished': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      createRoom({
        name: roomName.trim(),
        maxPlayers,
        difficulty,
        playerData: {
          name: 'You',
          avatar: '🎯'
        }
      });
      onJoinRace();
    }
  };

  const handleJoinRoom = (roomId: string, room: Room) => {
    if (room.status === 'Waiting' && room.players < room.maxPlayers) {
      joinRoom(roomId, {
        name: 'You',
        avatar: '🎯'
      });
      onJoinRace();
    }
  };

  const handleQuickJoin = () => {
    // Find the first available room
    const availableRoom = availableRooms.find(
      room => room.status === 'Waiting' && room.players < room.maxPlayers
    );
    
    if (availableRoom) {
      handleJoinRoom(availableRoom.id, availableRoom);
    } else {
      // Create a quick room if none available
      createRoom({
        name: 'Quick Race Room',
        maxPlayers: 4,
        difficulty: 'Medium',
        playerData: {
          name: 'You',
          avatar: '🎯'
        }
      });
      onJoinRace();
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏎️ Racing Rooms</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'join' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🔍 Join Room
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ➕ Create Room
          </button>
        </div>

        {/* Join Room Tab */}
        {activeTab === 'join' && (
          <div>
            {!isConnected && (
              <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  🔄 Connecting to server... Please wait.
                </p>
              </div>
            )}
            
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Rooms</h3>
              <div className="text-sm text-gray-400">
                {availableRooms.filter(r => r.status === 'Waiting').length} rooms waiting for players
              </div>
            </div>
            
            <div className="space-y-3">
              {availableRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {isConnected ? 'No rooms available. Create one to get started!' : 'Loading rooms...'}
                </div>
              ) : (
                availableRooms.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{room.name}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-300">
                          👥 {room.players}/{room.maxPlayers} players
                        </span>
                        <span className={`font-medium ${getDifficultyColor(room.difficulty)}`}>
                          {room.difficulty}
                        </span>
                        <span className={`font-medium ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinRoom(room.id, room)}
                      disabled={room.status !== 'Waiting' || room.players >= room.maxPlayers}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        room.status === 'Waiting' && room.players < room.maxPlayers
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {room.status === 'Waiting' && room.players < room.maxPlayers 
                        ? 'Join' 
                        : room.status === 'In Progress' 
                        ? 'In Progress' 
                        : 'Full'
                      }
                    </button>
                  </div>
                </motion.div>
                ))
              )}
            </div>

            {/* Quick Join */}
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <h4 className="font-semibold text-blue-300 mb-2">⚡ Quick Join</h4>
              <p className="text-sm text-gray-300 mb-3">
                Jump into the next available room that matches your skill level.
              </p>
              <button
                onClick={handleQuickJoin}
                disabled={!isConnected}
                className={`btn-primary ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                🎮 Quick Join
              </button>
            </div>
          </div>
        )}

        {/* Create Room Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Players
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
                <option value={5}>5 Players</option>
                <option value={6}>6 Players</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                      difficulty === diff
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateRoom}
                disabled={!roomName.trim() || !isConnected}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  roomName.trim() && isConnected
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                🎯 Create & Start Room
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Room Preview */}
            {roomName && (
              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">Room Preview</h4>
                <div className="text-sm space-y-1">
                  <div>Name: <span className="text-blue-300">{roomName}</span></div>
                  <div>Max Players: <span className="text-blue-300">{maxPlayers}</span></div>
                  <div>Difficulty: <span className={getDifficultyColor(difficulty)}>{difficulty}</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}