export interface User {
  username: string;
  id: number;
  elo: number;
  win: number;
  loose: number;
  createAt: string;
  updateAt: string;
  state: string;
}

export interface rankData {
  id: number;
  username: string;
  elo: number;
  win: number;
  loose: number;
  rank?: number;
}
