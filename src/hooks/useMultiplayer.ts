'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, Room } from '../types/multiplayer';

export function useMultiplayer(user: { id: string; email?: string } | null) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeEmotes, setActiveEmotes] = useState<{ id: string, playerId: string, emoji: string }[]>([]);

    useEffect(() => {
        // Only connect if we have a user
        if (!user) return;

        // Connect to the Socket.IO server (running on the same origin/port)
        const socketInstance = io();

        socketInstance.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            setCurrentRoom(null);
            setCurrentPlayer(null);
        });

        socketInstance.on('rooms:list', (roomList: Room[]) => {
            setRooms(roomList);
        });

        socketInstance.on('room:join:failed', (data: { message: string }) => {
            setError(data.message);
        });

        socketInstance.on('room:joined', (data: { room: Room; player: Player }) => {
            setCurrentRoom(data.room);
            setCurrentPlayer(data.player);
            setError(null);
        });

        socketInstance.on('room:created', (data: { room: Room; player: Player }) => {
            setCurrentRoom(data.room);
            setCurrentPlayer(data.player);
            setError(null);
        });

        socketInstance.on('room:updated', (updatedRoom: Room) => {
            setCurrentRoom(updatedRoom);
            // Update currentPlayer reference if it exists in the updated room
            if (socketInstance.id) {
                const me = updatedRoom.players.find((p) => p.id === socketInstance.id);
                if (me) setCurrentPlayer(me);
            }
        });

        socketInstance.on('race:countdown', (data: { countdown: number }) => {
            setCurrentRoom(prev => prev ? { ...prev, countdown: data.countdown } : null);
        });

        socketInstance.on('race:start', (data: { room: Room }) => {
            setCurrentRoom(data.room);
        });

        socketInstance.on('race:finished', (data: { room: Room, winner: Player }) => {
            setCurrentRoom(data.room); // The room status will be 'Finished'
        });

        socketInstance.on('room:emote', (data: { playerId: string, emoji: string }) => {
            const emoteId = Math.random().toString(36).substring(7);
            setActiveEmotes(prev => [...prev, { id: emoteId, playerId: data.playerId, emoji: data.emoji }]);

            // Auto remove after 2 seconds
            setTimeout(() => {
                setActiveEmotes(prev => prev.filter(e => e.id !== emoteId));
            }, 2000);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

    const createRoom = useCallback((name: string, difficulty: string = 'Medium') => {
        if (!socket || !user) return;
        socket.emit('room:create', {
            name,
            difficulty,
            maxPlayers: 4,
            playerData: {
                name: user.email?.split('@')[0] || 'Player',
                avatar: user.email?.[0].toUpperCase() || 'U'
            }
        });
    }, [socket, user]);

    const joinRoom = useCallback((roomId: string) => {
        if (!socket || !user) return;
        socket.emit('room:join', {
            roomId,
            playerData: {
                name: user.email?.split('@')[0] || 'Player',
                avatar: user.email?.[0].toUpperCase() || 'U'
            }
        });
    }, [socket, user]);

    const leaveRoom = useCallback(() => {
        if (!socket) return;
        socket.emit('room:leave');
        setCurrentRoom(null);
        setCurrentPlayer(null);
    }, [socket]);

    const setReady = useCallback(() => {
        if (!socket) return;
        socket.emit('player:ready');
    }, [socket]);

    const sendProgress = useCallback((progress: number, wpm: number, accuracy: number) => {
        if (!socket) return;
        socket.emit('player:progress', { progress, wpm, accuracy });
    }, [socket]);

    const sendEmote = useCallback((emoji: string) => {
        if (!socket) return;
        socket.emit('player:emote', { emoji });
    }, [socket]);

    return {
        socket,
        isConnected,
        rooms,
        currentRoom,
        currentPlayer,
        error,
        createRoom,
        joinRoom,
        leaveRoom,
        setReady,
        sendProgress,
        sendEmote,
        activeEmotes
    };
}
