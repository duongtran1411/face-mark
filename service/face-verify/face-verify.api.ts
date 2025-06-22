import axios from "axios";
import Toast from "react-native-toast-message";
import axiosInstance from "../axios.service";

export const FaceVerifyImage = async (
  studentId: number,
  scheduleId: number,
  image: string,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      "face-api/verify-face",
      {
        studentId,
        scheduleId,
        image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response || axios.isAxiosError(error)) {
      Toast.show({
        type: "error",
        text1: error.response.data.message || "Đã có lỗi xảy ra",
      });
    }
  }
};