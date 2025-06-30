import { ClassData } from "./Classdata";
import { StudentAttendance } from "./StudentAttendance";
import { Teacher } from "./Teacher";
export interface AttendanceListResponse {
    teacher: Teacher;
    class: ClassData;
    scheduleId: string;
    students: StudentAttendance[];
    totalStudents: number;
    totalAttended: number;
  }

  export interface AttendanceStudent{
    id: number
    status: number
    note?:string
    updatedAt:string
    teacher: Teacher
  }