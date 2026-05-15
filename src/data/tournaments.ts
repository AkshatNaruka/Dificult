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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA45Iz2BLH_KCKAnjDWCtwpwEvyEkaWXg7amjQ8YnsU3a5PABdALbEItDZBTmcQIDbMPIA0sz2pexWDfw7QaCForSAfYReN4c4d82cerpQ6q77wHHrQhDwPo0I116vzIuaAMBiv9LA2jHWyuFV2x7S8EzlWfHGgZwSLF0TyBFi-coqH93bDKZ8bVh3k7nqHMZ6Rk-pC25Y5d1Fji9YKpTQF-Ekw44rKlywjXe8Fd27TQDSByXe6zBhiqzwCHFV39WWAE_UbmMC4vGS7',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANZ83T9t-CdmT4OGybnQNaQhd1DBZXMuYVKiHyVQz5y0wJhqdKTia0R5acxBg4Guu8nBPg0_zvMGVNFHQa5WA4dlot8-AU5dtJq_FOoogcS3y7Y3p7dRcqzYQoSE8MeWPb2nGCZvWO6m1SC7GTusS6HGvWBI5bPSDdRBLmUfHOCJ405nZE9eeQGK19Z2q2rcDoj8W9KQROmQiO2tPuFv5n9gH9xAEU300TQq9h0tYLPoz2_QcMS3AZPTkP_3-s8eLpXS5rdAQzi9qh',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4wRNdBe5h_fvzuPQjCIraSEbGptklRTNGbHSWBjIZZuzQ7EXbIgfPlEHzNBtvGs2jxn2EYx-JH8lVUZl7wEhAzbO78DbEztzoitMIl12vFhROGFzN84QHjUVi_Y-cvsx-NmIjQCuD6DUjiVXqSKwHtl1v2iTLv1VrS-BvYKFl90INGYlfFsj5fcSV24oXZbi92UTNWjvjsL5BoOXnYkD4wGLXr67-aWLMt1obtqYvl-xW4_49HrNKesK0N_67BW0tUWAkP4nQzt7N',
  },
];
