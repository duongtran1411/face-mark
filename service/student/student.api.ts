import axios from "axios";
import Toast from "react-native-toast-message";
import axiosInstance from "../axios.service";
export const getStudentByClass = async (id:number,token:string) => {
    try {
        const response = await axiosInstance.get(`/attendance/schedule/${id}`, {
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