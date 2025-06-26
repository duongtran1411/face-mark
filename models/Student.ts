export interface Student {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    studentId: string | null;
    name: string;
    email: string;
    gender: 'Nam' | 'Nữ' | 'Khác' | string;
    birthdate: string | null;
    phone: string;
    permanentResidence: string | null;
    avatar: string | null;
    cardId: string | null;
    status: string;
    total_retake_attempts: number;
    userId: number | null;
  }
  
  export interface StudentResponse {
    student: Student;
  }
  