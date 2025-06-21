import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { CameraView as ExpoCameraView } from "expo-camera";
import { CameraView, useCameraPermissions } from "expo-camera";
import Toast from "react-native-toast-message";

interface FaceScanCameraProps {
  onClose: () => void;
  onScanComplete: (base64Image: string) => void;
  studentName?: string;
}

const { width, height } = Dimensions.get("window");

export default function FaceScanCamera({
  onClose,
  onScanComplete,
  studentName,
}: FaceScanCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<ExpoCameraView | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);

    if (Platform.OS !== "web" && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
          exif: false,
        });
        if (photo?.base64) {
          onScanComplete(photo.base64);
        } else {
          Toast.show({
            type:'error',
            text1:'không thể lấy dữ liệu ảnh'
          });
          setIsScanning(false);
        }
      } catch (error) {
        console.error("Lỗi chụp ảnh:", error);
        Toast.show({
          type:'error',
          text1:'không thể xác thực khuôn mặt'
        });
        setIsScanning(false);
      }
    } else {
      // Logic mô phỏng cho web
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        onScanComplete("fake_base64_string_for_web_testing");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể quét khuôn mặt (mô phỏng).");
        setIsScanning(false);
      }
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
    </View>
  );

  if (Platform.OS !== "web") {
    if (!permission) {
      // Đang loading thông tin quyền
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Đang kiểm tra quyền camera...
          </Text>
        </View>
      );
    }

    if (!permission.granted) {
      // Không có quyền
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
      <CameraView ref={cameraRef} style={styles.container} facing="back">
        {renderOverlay()}
      </CameraView>
    );
  }

  // Fallback for web
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
