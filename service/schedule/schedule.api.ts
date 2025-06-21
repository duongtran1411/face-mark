import axios from "axios";
import Toast from "react-native-toast-message";
import axiosInstance from "../axios.service";

export const getScheduleTeacher = async (date:string, token:string) => {
    try {
        const response = await axiosInstance.get(`/schedules/teacher/${date}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;
    } catch (error: any) {
        if (error.response || axios.isAxiosError(error)) {
            Toast.show({
                type: 'error', 
                text1: error.response.data.message || 'Đã có lỗi xảy ra'
            });
        }
    }
}

export const getScheduleById = async (id: number, token: string) => {
    try {
        const response = await axiosInstance.get(`/schedules/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response || axios.isAxiosError(error)) {
            Toast.show({
                type: 'error',
                text1: error.response.data.message || 'Đã có lỗi xảy ra',
            });
        }
    }
};