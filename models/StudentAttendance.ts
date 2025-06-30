
import { Student } from "./Student";
export interface StudentAttendance {
    student: Student;
    status: number; 
    note?: string | null;
}

