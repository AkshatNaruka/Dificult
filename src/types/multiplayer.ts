export interface Player {
    id: string; // Socket ID
    name: string;
    avatar: string; // Could be emoji or URL
    position: number;
    wpm: number;
    accuracy: number;
    progress: number; // 0 to 100 percentage
    isFinished: boolean;
    isReady: boolean;
    roomId?: string;
}

export interface Room {
    id: string;
    name: string;
    players: Player[];
    maxPlayers: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Waiting' | 'In Progress' | 'Finished';
    text: string;
    startTime: number | null;
    isStarted: boolean;
    countdown: number;
}
