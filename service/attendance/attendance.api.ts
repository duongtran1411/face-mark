import axios from "axios";
import Toast from "react-native-toast-message";
import axiosInstance from "../axios.service";

export const markAttendance = async (
  data: {
    status: number;
    note?: string;
    teacherId: number;
    studentId: number;
    classId: number;
    scheduleId: number;
  },
  token: string
) => {
  try {
    const response = await axiosInstance.post(`/attendance/mark`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response || axios.isAxiosError(error)) {
      Toast.show({
        type: "error",
        text1: error.response.data.message || "Đã có lỗi xảy ra",
      });
    }
    throw error;
  }
};

// mark/multiple

export const markMultipleAttendance = async (
  data: {
    status: number;
    note?: string;
    teacherId: number;
    studentId: number;
    classId: number;
    scheduleId: number;
  }[],
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      `/attendance/mark/multiple`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response || axios.isAxiosError(error)) {
      Toast.show({
        type: "error",
        text1: error.response.data.message || "Đã có lỗi xảy ra",
      });
    }
    throw error;
  }
};
