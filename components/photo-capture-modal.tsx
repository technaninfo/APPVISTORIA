import { View, Text, Pressable, TextInput, FlatList, ScrollView, Modal, ActivityIndicator } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { PhotoWithCaption } from "@/lib/checklist-data";

interface PhotoCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (photos: PhotoWithCaption[]) => void;
  existingPhotos?: PhotoWithCaption[];
}

export function PhotoCaptureModal({
  visible,
  onClose,
  onSave,
  existingPhotos = [],
}: PhotoCaptureModalProps) {
  const [photos, setPhotos] = useState<PhotoWithCaption[]>(existingPhotos);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      setIsLoading(true);
      // Solicitar permissão de galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de galeria é necessária");
        setIsLoading(false);
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoWithCaption = {
          id: `photo_${Date.now()}`,
          uri: result.assets[0].uri,
          caption: caption || "Sem legenda",
          timestamp: new Date().toISOString(),
        };

        setPhotos([...photos, newPhoto]);
        setCaption("");

        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapturePhoto = async () => {
    try {
      setIsLoading(true);
      // Solicitar permissão de câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de câmera é necessária");
        setIsLoading(false);
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoWithCaption = {
          id: `photo_${Date.now()}`,
          uri: result.assets[0].uri,
          caption: caption || "Sem legenda",
          timestamp: new Date().toISOString(),
        };

        setPhotos([...photos, newPhoto]);
        setCaption("");

        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSave = () => {
    if (photos.length === 0) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    onSave(photos);
    setPhotos([]);
    setCaption("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-4 pt-12">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Adicionar Fotos</Text>
            <Pressable onPress={onClose}>
              <Text className="text-white text-lg">✕</Text>
            </Pressable>
          </View>
          <Text className="text-white/80 text-sm mt-2">
            Adicione fotos com legendas para este item reprovado
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          <View className="gap-6">
            {/* Input Section */}
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Legenda da Foto</Text>
              <TextInput
                placeholder="Ex: Trinca na parede, Vazamento..."
                value={caption}
                onChangeText={setCaption}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                editable={!isLoading}
              />
            </View>

            {/* Camera Buttons */}
            <View className="gap-3">
              <Pressable
                onPress={handleCapturePhoto}
                disabled={isLoading}
                style={({ pressed }) => [
                  {
                    opacity: pressed || isLoading ? 0.7 : 1,
                    backgroundColor: "#0a7ea4",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                  },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">📷 Tirar Foto</Text>
                )}
              </Pressable>

              <Pressable
                onPress={handlePickImage}
                disabled={isLoading}
                style={({ pressed }) => [
                  {
                    opacity: pressed || isLoading ? 0.7 : 1,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                ]}
              >
                <Text className="text-foreground font-semibold">🖼️ Galeria</Text>
              </Pressable>
            </View>

            {/* Photos List */}
            {photos.length > 0 && (
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">
                  Fotos Adicionadas ({photos.length})
                </Text>

                <FlatList
                  scrollEnabled={false}
                  data={photos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View className="bg-surface border border-border rounded-lg p-3 mb-3">
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground">📷 Foto</Text>
                          <Text className="text-xs text-muted mt-1">{item.caption}</Text>
                          <Text className="text-xs text-muted mt-1">
                            {new Date(item.timestamp).toLocaleTimeString("pt-BR")}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => handleRemovePhoto(item.id)}
                          style={({ pressed }) => [
                            {
                              opacity: pressed ? 0.7 : 1,
                              backgroundColor: "#fee2e2",
                              borderRadius: 6,
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                            },
                          ]}
                        >
                          <Text className="text-error text-sm font-semibold">✕</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Text className="text-xs text-blue-900">
                ℹ️ Adicione pelo menos uma foto para este item reprovado. Você pode adicionar múltiplas
                fotos com legendas diferentes.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View className="border-t border-border px-6 py-4 gap-3 bg-background">
          <Pressable
            onPress={handleSave}
            disabled={photos.length === 0 || isLoading}
            style={({ pressed }) => [
              {
                opacity: pressed || photos.length === 0 ? 0.7 : 1,
                backgroundColor: photos.length === 0 ? "#d1d5db" : "#0a7ea4",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              },
            ]}
          >
            <Text className="text-white font-semibold">Salvar Fotos</Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-primary font-semibold">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
