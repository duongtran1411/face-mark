export interface Class {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleteAt: string;
    name: string;
    status: string | null;
    admissionDate: string;
}