import { Building } from "./Building";

export interface Classroom {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    building: Building;
}