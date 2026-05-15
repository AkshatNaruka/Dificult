export interface TournamentSponsor {
  name: string;
  logoText: string;
  url: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  description: string;
  entryFee: string;
  prizePool: string;
  sponsor: TournamentSponsor;
  leaderboardNote: string;
  image?: string;
}
