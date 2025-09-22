import api from "./api";
import type { Room } from "@/interfaces/room.interface";

export const getRoomsApi = async ():Promise<Room[]> => {
  const res = await api.get("phong-thue");
  return res.data.content;
};

export const getRoomDetailApi = async (id: number): Promise<Room> => {
  const res = await api.get(`phong-thue/${id}`);
  return res.data.content;
};