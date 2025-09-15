# TypeWarrior Multiplayer Setup

This guide explains how to set up and run the multiplayer version of TypeWarrior with real-time Socket.IO functionality.

## 🚀 Quick Start

### Development Mode

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the multiplayer server**
   ```bash
   npm run dev:server
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

4. **Test Multiplayer**
   - Click "Type Racing" mode
   - Click "Join Race" to see available rooms
   - Join a room or create a new one
   - Open multiple browser tabs/windows to simulate multiple players

### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start:server
   ```

## 🎮 How Multiplayer Works

### Room System
- **Join Existing Rooms**: Browse and join rooms created by other players
- **Create New Rooms**: Set room name, max players (2-6), and difficulty
- **Quick Join**: Automatically join the best available room

### Race Flow
1. **Join Room**: Players join and see real-time updates
2. **Ready Up**: Players click "Ready to Race" when prepared
3. **Countdown**: 3-second countdown when all players are ready
4. **Race**: Real-time typing with live progress updates
5. **Results**: See final positions and winner

### Real-time Features
- Live player count in rooms
- Real-time progress tracking
- Position updates during race
- Player join/leave notifications
- Race countdown synchronization

## 🛠️ Technical Architecture

### Backend (server.js)
- **Socket.IO Server**: Handles real-time communication
- **Room Management**: Create, join, leave room functionality
- **Race Coordination**: Countdown, start, finish logic
- **Player Tracking**: Progress, position, and statistics

### Frontend
- **useSocket Hook**: Socket.IO connection and event handling
- **RoomSelector**: Real-time room browsing and creation
- **MultiplayerRace**: Live race interface with progress tracking
- **Zustand Store**: State management for race data

### Socket Events
- `room:join` - Join an existing room
- `room:create` - Create a new room
- `player:ready` - Mark player as ready to race
- `player:progress` - Update typing progress
- `race:countdown` - Countdown before race start
- `race:start` - Race begins
- `race:finished` - Race ends with results

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js development server only |
| `npm run dev:server` | Full multiplayer server (recommended) |
| `npm run build` | Build for production |
| `npm run start:server` | Production multiplayer server |

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set custom port
PORT=3000

# Optional: Set environment
NODE_ENV=production
```

### Server Settings
The server creates default rooms on startup:
- Speed Demons Only (Hard, 4 players)
- Beginner Friendly (Easy, 6 players)  
- Quick Race (Medium, 3 players)
- Late Night Session (Medium, 5 players)

## 🌐 Multiple Players Testing

To test with multiple players:

1. **Same Device**: Open multiple browser tabs/windows
2. **Different Devices**: 
   - Find your local IP address
   - Other devices connect to `http://[YOUR-IP]:3000`
3. **Network Setup**: Ensure port 3000 is accessible on your network

## 🐛 Troubleshooting

### Connection Issues
- Check if server is running on port 3000
- Verify firewall settings for local network access
- Clear browser cache if experiencing stale data

### Race Not Starting
- Ensure at least 2 players are in the room
- All players must click "Ready to Race"
- Check console for Socket.IO connection errors

### Progress Not Syncing
- Verify Socket.IO connection status
- Check network connectivity
- Refresh the page to reconnect

## 🚀 Deployment

For production deployment:

1. **Update Socket.IO URL**: Modify `useSocket.ts` for your domain
2. **Environment Setup**: Configure production environment variables
3. **Process Management**: Use PM2 or similar for server management
4. **Reverse Proxy**: Configure nginx/Apache if needed

## 🎯 Features Implemented

✅ **Core Multiplayer**
- Real-time room management
- Live player synchronization
- Race countdown and coordination
- Progress tracking and positions

✅ **User Experience**
- Intuitive room browsing
- Connection status indicators
- Responsive real-time updates
- Seamless race flow

✅ **Server Infrastructure**
- Robust Socket.IO server
- Room state management
- Player disconnection handling
- Race coordination logic

## 📈 Future Enhancements

- Spectator mode for ongoing races
- Race replay system
- Tournament brackets
- Player rankings and statistics
- Custom race texts
- Voice chat integration