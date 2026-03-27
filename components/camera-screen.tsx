import { View, Pressable, Text, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { ScreenContainer } from "./screen-container";
import { LargeButton } from "./large-button";

interface CameraScreenProps {
  onPhotoTaken: (photoUri: string) => void;
  onCancel: () => void;
}

export function CameraScreen({ onPhotoTaken, onCancel }: CameraScreenProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  if (!permission) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="items-center justify-center gap-4">
        <Text className="text-lg font-semibold text-foreground">Permissão de Câmera Necessária</Text>
        <LargeButton
          title="Permitir Acesso à Câmera"
          onPress={requestPermission}
          variant="primary"
        />
      </ScreenContainer>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setCapturedPhoto(photo.uri);
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUsePhoto = async () => {
    if (capturedPhoto) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onPhotoTaken(capturedPhoto);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  if (capturedPhoto) {
    return (
      <ScreenContainer className="p-6 gap-4">
        <View className="flex-1 bg-black rounded-2xl overflow-hidden mb-4" />
        <View className="gap-3">
          <LargeButton title="Usar Foto" onPress={handleUsePhoto} variant="success" />
          <LargeButton title="Tirar Novamente" onPress={handleRetake} variant="secondary" />
          <Pressable onPress={onCancel}>
            <Text className="text-center text-primary font-semibold">Cancelar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-6 gap-3">
        <Pressable
          onPress={handleCapture}
          disabled={isCapturing}
          style={({ pressed }) => [
            {
              transform: [{ scale: pressed && !isCapturing ? 0.95 : 1 }],
              opacity: isCapturing ? 0.5 : 1,
            },
          ]}
          className="items-center justify-center"
        >
          <View className="w-16 h-16 bg-white rounded-full items-center justify-center border-4 border-white/30" />
        </Pressable>
        <Pressable onPress={onCancel}>
          <Text className="text-center text-white font-semibold">Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
