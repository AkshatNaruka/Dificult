import { create } from 'zustand';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  wpm: number;
  accuracy: number;
  progress: number;
  isFinished: boolean;
}

export interface RaceRoom {
  id: string;
  name: string;
  players: Player[];
  text: string;
  isStarted: boolean;
  isFinished: boolean;
  maxPlayers: number;
  createdAt?: Date;
  difficulty?: string;
  status?: string;
  countdown?: number;
}

interface RaceState {
  currentRoom: RaceRoom | null;
  availableRooms: RaceRoom[];
  currentPlayer: Player | null;
  isConnected: boolean;
  
  // Actions
  setCurrentRoom: (room: RaceRoom | null) => void;
  setAvailableRooms: (rooms: RaceRoom[]) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setIsConnected: (connected: boolean) => void;
  updatePlayerProgress: (playerId: string, progress: number, wpm: number, accuracy: number) => void;
}

export const useRaceStore = create<RaceState>((set, get) => ({
  currentRoom: null,
  availableRooms: [],
  currentPlayer: null,
  isConnected: false,

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  updatePlayerProgress: (playerId, progress, wpm, accuracy) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(player => 
      player.id === playerId 
        ? { ...player, progress, wpm, accuracy, isFinished: progress >= 100 }
        : player
    );
    
    set({
      currentRoom: {
        ...currentRoom,
        players: updatedPlayers,
        isFinished: updatedPlayers.some(p => p.isFinished)
      }
    });
  },
}));