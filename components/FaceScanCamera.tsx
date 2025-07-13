import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FaceVerificationResponse } from "@/models/FaceVerificationResponse";
import { FaceVerifyImage } from "@/service/face-verify/face-verify.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CameraView as ExpoCameraView } from "expo-camera";
import { CameraView, useCameraPermissions } from "expo-camera";
import Toast from "react-native-toast-message";

interface FaceScanCameraProps {
  onClose: () => void;
  onVerificationSuccess: (
    studentId: number,
    verificationData?: FaceVerificationResponse
  ) => void;
  studentName?: string;
  studentId: number;
  scheduleId: number;
}

export default function FaceScanCamera({
  onClose,
  onVerificationSuccess,
  studentName,
  studentId,
  scheduleId,
}: FaceScanCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<ExpoCameraView | null>(null);
  const [lastImageDataUrl, setLastImageDataUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (!cameraRef.current) return null;

    return await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
      exif: false,
      skipProcessing: false,
      // Không chỉ định imageType để camera tự chọn format tốt nhất
      // Có thể là jpg, png, webp tùy theo thiết bị và camera
    });
  };

  const handleScan = async () => {
    if (isScanning || !cameraRef.current) return;

    setIsScanning(true);
    Toast.show({
      type: "info",
      text1: "Đang xử lý ảnh...",
    });

    try {
      const photo = await takePicture();
      if (!photo?.base64) {
        Toast.show({ type: "error", text1: "Không thể lấy dữ liệu ảnh" });
        setIsScanning(false);
        return;
      }

      console.log("IMAGE BASE64:", photo.base64?.slice(0, 100));

      const token = (await AsyncStorage.getItem("access_token")) || "";

      // Tự động detect format từ base64 hoặc sử dụng JPEG làm default
      let imageFormat = "jpeg";
      if (photo.base64) {
        // Kiểm tra magic bytes để detect format chính xác hơn
        const firstBytes = photo.base64.substring(0, 12);
        if (firstBytes.includes("iVBORw0KGgo")) {
          imageFormat = "png";
        } else if (firstBytes.includes("UklGR")) {
          imageFormat = "webp";
        } else if (firstBytes.includes("R0lGOD")) {
          imageFormat = "gif";
        } else if (firstBytes.includes("U2FtcGxl")) {
          imageFormat = "bmp";
        } else if (firstBytes.includes("SUkqAA")) {
          imageFormat = "tiff";
        }
        // JPEG là default nếu không match format nào khác
        // JPEG thường bắt đầu với /9j/4AAQSkZJRgABAQAAAQABAAD...
      }

      const imageDataUrl = `data:image/${imageFormat};base64,${photo.base64}`;
      console.log("IMAGE FORMAT:", imageFormat);
      console.log("BASE64 FIRST 20 CHARS:", photo.base64.substring(0, 20));
      console.log("IMAGE DATA URL:", imageDataUrl.slice(0, 400));
      setLastImageDataUrl(imageDataUrl);

      // Gửi ảnh về API một lần duy nhất
      const result = await FaceVerifyImage(
        studentId,
        scheduleId,
        imageDataUrl,
        token
      );
      console.log("RESULT:", result);

      if (result && result.data && result.data.isMatch) {
        Toast.show({
          type: "success",
          text1: result.message || "Xác thực khuôn mặt thành công",
          text2: `Sinh viên: ${result.data.student.name} (${result.data.student.studentId})`,
        });
        onVerificationSuccess(studentId, result);
        setIsScanning(false);
        onClose();
      } else if (result && result.data && !result.data.isMatch) {
        const { confidence, traditionalSimilarity } = result.data;
        Toast.show({
          type: "error",
          text1: result.message || "Xác thực khuôn mặt thất bại",
          text2: `Độ tin cậy AI: ${(confidence * 100).toFixed(
            1
          )}% | Độ tương đồng truyền thống: ${(
            traditionalSimilarity * 100
          ).toFixed(1)}%`,
        });
        setIsScanning(false);
        onClose();
      } else if (result && result.message) {
        Toast.show({
          type: "error",
          text1: result.message,
        });
        setIsScanning(false);
      } else {
        Toast.show({ type: "error", text1: "Không thể xác thực khuôn mặt" });
        setIsScanning(false);
      }
    } catch (error: any) {
      console.error("Lỗi chụp ảnh hoặc xác thực:", error, error?.response);

      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage: string = error.response.data.message;
        if (errorMessage.includes("Không phát hiện được khuôn mặt")) {
          Toast.show({
            type: "error",
            text1: "Không phát hiện được khuôn mặt",
            text2:
              "Hãy đảm bảo khuôn mặt rõ ràng, đủ ánh sáng và nhìn thẳng vào camera",
          });
        } else {
          Toast.show({ type: "error", text1: errorMessage });
        }
      } else if (typeof error === "string") {
        Toast.show({ type: "error", text1: error });
      } else {
        Toast.show({ type: "error", text1: "Không thể xác thực khuôn mặt" });
      }
      setIsScanning(false);
    }
  };

  const renderOverlay = () => (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Quét khuôn mặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.scanArea}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.scanText}>
          {studentName
            ? `Đặt khuôn mặt của ${studentName} vào khung`
            : "Đặt khuôn mặt vào khung"}
        </Text>
        <Text
          style={[
            styles.scanText,
            { fontSize: 14, marginTop: 10, opacity: 0.8 },
          ]}
        >
          Đảm bảo khuôn mặt rõ ràng, đủ ánh sáng và nhìn thẳng vào camera
        </Text>
        <Text
          style={[
            styles.scanText,
            { fontSize: 12, marginTop: 5, opacity: 0.7 },
          ]}
        >
          Giữ khoảng cách 30-50cm, tránh bóng đổ trên mặt
        </Text>
        {Platform.OS === "web" && (
          <Text
            style={[
              styles.scanText,
              { marginTop: 10, backgroundColor: "rgba(90,90,90,0.7)" },
            ]}
          >
            Camera không khả dụng - Đây là mô phỏng
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <Ionicons
            name={isScanning ? "scan" : "scan-circle-outline"}
            size={70}
            color={isScanning ? "#888" : "#fff"}
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? "Đang xử lý..." : "Quét khuôn mặt"}
          </Text>
        </TouchableOpacity>
      </View>

      {lastImageDataUrl && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ color: "white" }}>Ảnh vừa chụp:</Text>
          <Image
            source={{ uri: lastImageDataUrl }}
            style={{ width: 200, height: 250, borderRadius: 10, marginTop: 10 }}
          />
        </View>
      )}
    </View>
  );

  if (Platform.OS !== "web") {
    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Đang kiểm tra quyền camera...
          </Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Không có quyền truy cập camera.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Cấp quyền</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
        />
        {renderOverlay()}
      </View>
    );
  }

  return <View style={styles.container}>{renderOverlay()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    width: "100%",
  },
  closeButton: {
    padding: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scanArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  scanFrame: {
    width: 280,
    height: 380,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#34C759",
  },
  topLeft: { borderTopWidth: 5, borderLeftWidth: 5, top: 0, left: 0 },
  topRight: { borderTopWidth: 5, borderRightWidth: 5, top: 0, right: 0 },
  bottomLeft: { borderBottomWidth: 5, borderLeftWidth: 5, bottom: 0, left: 0 },
  bottomRight: {
    borderBottomWidth: 5,
    borderRightWidth: 5,
    bottom: 0,
    right: 0,
  },
  scanText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
    maxWidth: "85%",
  },
  controls: {
    width: "100%",
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scanButton: {
    alignItems: "center",
  },
  scanButtonDisabled: {
    opacity: 0.4,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#34C759",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
