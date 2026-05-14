import { Tournament } from '@/types/tournament';

export const tournaments: Tournament[] = [
  {
    id: 'spring-sprint-2026',
    name: 'Spring Sprint Championship',
    date: '2026-06-01',
    description: 'Monthly speed tournament with a live leaderboard and qualifying rounds.',
    entryFee: '$5 entry or free with Pro',
    prizePool: '$500 prize pool + sponsor gear',
    sponsor: {
      name: 'Keychron',
      logoText: 'Keychron',
      url: 'https://www.keychron.com',
    },
    leaderboardNote: 'Top 50 live, sponsor branding featured during finals.',
  },
  {
    id: 'summer-precision-2026',
    name: 'Summer Precision Open',
    date: '2026-07-15',
    description: 'Accuracy-first event with surprise daily heats.',
    entryFee: '$4 entry or free with Pro',
    prizePool: '$350 prize pool + limited edition keycaps',
    sponsor: {
      name: 'Drop',
      logoText: 'Drop',
      url: 'https://drop.com',
    },
    leaderboardNote: 'Accuracy leaderboard with sponsor highlight cards.',
  },
  {
    id: 'night-owl-2026',
    name: 'Night Owl Marathon',
    date: '2026-08-20',
    description: 'Long-form endurance challenge with live shout-outs.',
    entryFee: '$6 entry or free with Pro',
    prizePool: '$750 prize pool + ergonomic gear',
    sponsor: {
      name: 'ZSA',
      logoText: 'ZSA',
      url: 'https://www.zsa.io',
    },
    leaderboardNote: 'Endurance leaderboard plus sponsor-branded finals.',
  },
];
