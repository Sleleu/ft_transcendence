import { User } from "../types";

export interface Room {
    name: string;
    id: number;
    type: string;
    owner?: string;
}

export interface ChatRoomData {
	whitelist: User[];
	admins: User[];
	banned: User[];
	connected: User[];
	friends: User[];
	room: Room;
}
