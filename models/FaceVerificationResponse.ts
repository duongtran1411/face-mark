export interface Student {
  id: number;
  name: string;
  studentId: string;
}

export interface Attendance {
  id: number;
  status: number;
  updatedAt: string;
}

export interface FaceVerificationData {
  isMatch: boolean;
  confidence: number;
  traditionalSimilarity: number;
  aiAnalysis: string;
  student: Student;
  attendance: Attendance;
}

export interface FaceVerificationResponse {
  statusCode: number;
  message: string;
  data: FaceVerificationData;
}
