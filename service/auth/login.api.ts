import axios from "axios";
import Toast from "react-native-toast-message";
import axiosInstance from "../axios.service";
export const loginApi = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            username, password
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