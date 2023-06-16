export interface User {
  username: string;
  avatar?: string;
  avatarSelected?: boolean;
  gameLogin?: string;
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

export interface PublicUserInfo {
  state: boolean;
  gameLogin: string;
  elo: number;
  win: number;
  loose: number;
  avatar: string;
}