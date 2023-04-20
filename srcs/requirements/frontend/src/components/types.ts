export interface User {
  username: string;
  id: number;
  elo: number;
}

export interface rankData {
  id: number;
  username: string;
  elo: number;
  victory: number;
  defeat: number;
  rank?: number;
}
