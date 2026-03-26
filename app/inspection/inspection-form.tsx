import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Button } from "@/components/button";
import { useColors } from "@/hooks/use-colors";
import * as ImagePicker from "expo-image-picker";
import {
  FormRoom,
  FormItem,
  FormTest,
  PREDEFINED_ROOMS,
  STANDARD_ITEMS,
} from "@/lib/inspection-form-types";

export default function InspectionFormScreen() {
  const router = useRouter();
  const colors = useColors();
  const scrollViewRef = useRef<ScrollView>(null);

  // Estado do formulário
  const [rooms, setRooms] = useState<FormRoom[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [showRoomModal, setShowRoomModal] = useState(rooms.length === 0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  const currentRoom = rooms[currentRoomIndex];

  // Adicionar novo cômodo
  const handleAddRoom = (roomName: string, areaType: "internal" | "external") => {
    const newRoom: FormRoom = {
      id: `room_${Date.now()}`,
      name: roomName,
      areaType,
      items: STANDARD_ITEMS[areaType].map((item) => ({
        id: `item_${Date.now()}_${Math.random()}`,
        name: item.name,
        status: "pending",
        isExpanded: false,
        tests: item.tests.map((testName) => ({
          id: `test_${Date.now()}_${Math.random()}`,
          name: testName,
          status: "pending",
          photos: [],
        })),
      })),
      observations: "",
    };

    setRooms([...rooms, newRoom]);
    setCurrentRoomIndex(rooms.length);
    setShowRoomModal(false);
  };

  // Expandir/Recolher item
  const toggleItemExpanded = (itemId: string) => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      items: currentRoom.items.map((item) =>
        item.id === itemId ? { ...item, isExpanded: !item.isExpanded } : item
      ),
    };

    const updatedRooms = [...rooms];
    updatedRooms[currentRoomIndex] = updatedRoom;
    setRooms(updatedRooms);
  };

  // Atualizar status do teste
  const updateTestStatus = (
    itemId: string,
    testId: string,
    status: "approved" | "rejected" | "na"
  ) => {
    if (!currentRoom) return;

    if (status === "rejected") {
      setSelectedTestId(testId);
      setShowPhotoModal(true);
      return;
    }

    const updatedRoom = {
      ...currentRoom,
      items: currentRoom.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tests: item.tests.map((test) =>
                test.id === testId ? { ...test, status } : test
              ),
            }
          : item
      ),
    };

    const updatedRooms = [...rooms];
    updatedRooms[currentRoomIndex] = updatedRoom;
    setRooms(updatedRooms);
  };

  // Marcar item como NA
  const markItemAsNA = (itemId: string) => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      items: currentRoom.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "na" as const,
              tests: item.tests.map((test) => ({ ...test, status: "na" as const })),
            }
          : item
      ),
    };

    const updatedRooms = [...rooms];
    updatedRooms[currentRoomIndex] = updatedRoom;
    setRooms(updatedRooms);
  };

  // Adicionar foto
  const handleAddPhoto = async () => {
    if (!selectedTestId || !photoCaption.trim()) {
      Alert.alert("Aviso", "Adicione uma legenda antes de selecionar a foto");
      return;
    }

    setIsLoadingPhoto(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && currentRoom) {
        const photoUri = result.assets[0].uri;

        const updatedRoom = {
          ...currentRoom,
          items: currentRoom.items.map((item) => ({
            ...item,
            tests: item.tests.map((test) =>
              test.id === selectedTestId
                ? {
                    ...test,
                    status: "rejected" as const,
                    photos: [
                      ...test.photos,
                      {
                        id: `photo_${Date.now()}`,
                        uri: photoUri,
                        caption: photoCaption,
                      },
                    ],
                  }
                : test
            ),
          })),
        };

        const updatedRooms = [...rooms];
        updatedRooms[currentRoomIndex] = updatedRoom;
        setRooms(updatedRooms);

        setPhotoCaption("");
        setShowPhotoModal(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao capturar foto");
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  // Finalizar vistoria
  const handleFinish = () => {
    if (rooms.length === 0) {
      Alert.alert("Aviso", "Adicione pelo menos um cômodo para finalizar");
      return;
    }

    // Validar se todos os testes foram preenchidos
    let allFilled = true;
    for (const room of rooms) {
      for (const item of room.items) {
        if (item.status !== "na") {
          for (const test of item.tests) {
            if (test.status === "pending") {
              allFilled = false;
              break;
            }
          }
        }
        if (!allFilled) break;
      }
      if (!allFilled) break;
    }

    if (!allFilled) {
      Alert.alert(
        "Aviso",
        "Todos os testes devem ser preenchidos antes de finalizar"
      );
      return;
    }

    // Salvar dados e ir para resumo
    router.push("/inspection/summary");
  };

  if (rooms.length === 0) {
    return (
      <ScreenContainer className="flex-1">
        <View className="flex-1 items-center justify-center p-6 gap-4">
          <Text className="text-2xl font-bold text-foreground">
            Nenhum cômodo adicionado
          </Text>
          <Text className="text-base text-muted text-center">
            Comece adicionando o primeiro cômodo para iniciar a vistoria
          </Text>
          <Button
            title="Adicionar Cômodo"
            onPress={() => setShowRoomModal(true)}
            variant="primary"
          />
        </View>

        <RoomSelectionModal
          visible={showRoomModal}
          onClose={() => setShowRoomModal(false)}
          onSelect={handleAddRoom}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6 p-6 pb-20">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              {currentRoom.name}
            </Text>
            <Text className="text-base text-muted">
              {currentRoom.areaType === "internal" ? "Área Interna" : "Área Externa"}
            </Text>
          </View>

          {/* Items */}
          <View className="gap-3">
            {currentRoom.items.map((item) => (
              <ItemAccordion
                key={item.id}
                item={item}
                onToggleExpanded={() => toggleItemExpanded(item.id)}
                onMarkNA={() => markItemAsNA(item.id)}
                onTestStatusChange={(testId, status) =>
                  updateTestStatus(item.id, testId, status)
                }
              />
            ))}
          </View>

          {/* Observations */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Observações
            </Text>
            <TextInput
              placeholder="Adicione observações sobre este cômodo"
              value={currentRoom.observations}
              onChangeText={(text) => {
                const updatedRoom = { ...currentRoom, observations: text };
                const updatedRooms = [...rooms];
                updatedRooms[currentRoomIndex] = updatedRoom;
                setRooms(updatedRooms);
              }}
              multiline
              numberOfLines={4}
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Actions */}
          <View className="gap-2">
            <Button
              title="+ Adicionar Novo Cômodo"
              onPress={() => setShowRoomModal(true)}
              variant="secondary"
            />
            <Button
              title="Finalizar Vistoria"
              onPress={handleFinish}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <RoomSelectionModal
        visible={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSelect={handleAddRoom}
      />

      <PhotoCaptionModal
        visible={showPhotoModal}
        caption={photoCaption}
        onCaptionChange={setPhotoCaption}
        onAddPhoto={handleAddPhoto}
        onClose={() => setShowPhotoModal(false)}
        isLoading={isLoadingPhoto}
      />
    </ScreenContainer>
  );
}

// Componente de Item Acordeão
function ItemAccordion({
  item,
  onToggleExpanded,
  onMarkNA,
  onTestStatusChange,
}: {
  item: FormItem;
  onToggleExpanded: () => void;
  onMarkNA: () => void;
  onTestStatusChange: (testId: string, status: "approved" | "rejected" | "na") => void;
}) {
  const colors = useColors();

  return (
    <View className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <TouchableOpacity
        onPress={onToggleExpanded}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.name}
          </Text>
          <Text className="text-xs text-muted mt-1">
            {item.tests.length} testes
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          {item.status === "na" && (
            <View className="bg-gray-300 rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-gray-700">NA</Text>
            </View>
          )}
          <Text className="text-2xl">{item.isExpanded ? "▼" : "▶"}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {item.isExpanded && (
        <View className="border-t border-border p-4 gap-3">
          {item.tests.map((test) => (
            <TestRow
              key={test.id}
              test={test}
              onStatusChange={(status) => onTestStatusChange(test.id, status)}
            />
          ))}

          <TouchableOpacity
            onPress={onMarkNA}
            className="bg-gray-200 rounded-lg py-2 mt-2"
          >
            <Text className="text-center text-sm font-semibold text-gray-700">
              Marcar Item como Não Aplicável
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Componente de Teste
function TestRow({
  test,
  onStatusChange,
}: {
  test: FormTest;
  onStatusChange: (status: "approved" | "rejected" | "na") => void;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-sm text-foreground">{test.name}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onStatusChange("approved")}
            className={`w-10 h-10 rounded-lg items-center justify-center ${
              test.status === "approved" ? "bg-success" : "bg-gray-200"
            }`}
          >
            <Text className="text-lg font-bold">✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onStatusChange("rejected")}
            className={`w-10 h-10 rounded-lg items-center justify-center ${
              test.status === "rejected" ? "bg-red-500" : "bg-gray-200"
            }`}
          >
            <Text className="text-lg font-bold">✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onStatusChange("na")}
            className={`w-10 h-10 rounded-lg items-center justify-center ${
              test.status === "na" ? "bg-gray-400" : "bg-gray-200"
            }`}
          >
            <Text className="text-xs font-bold">NA</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fotos se reprovado */}
      {test.status === "rejected" && test.photos.length > 0 && (
        <View className="bg-gray-100 rounded-lg p-2 gap-1">
          {test.photos.map((photo) => (
            <Text key={photo.id} className="text-xs text-gray-600">
              📷 {photo.caption}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// Modal de Seleção de Cômodo
function RoomSelectionModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (roomName: string, areaType: "internal" | "external") => void;
}) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [customRoom, setCustomRoom] = useState("");
  const [areaType, setAreaType] = useState<"internal" | "external" | null>(null);

  const handleSelect = () => {
    const roomName = customRoom || selectedRoom;
    if (!roomName || !areaType) {
      Alert.alert("Aviso", "Selecione um cômodo e o tipo de área");
      return;
    }

    onSelect(roomName, areaType);
    setSelectedRoom(null);
    setCustomRoom("");
    setAreaType(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-background rounded-lg w-full max-w-sm p-6 gap-4">
          <Text className="text-2xl font-bold text-foreground">
            Novo Cômodo
          </Text>

          {/* Cômodos Predefinidos */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Cômodos Predefinidos
            </Text>
            <FlatList
              data={PREDEFINED_ROOMS}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedRoom(item)}
                  className={`p-3 rounded-lg mb-2 ${
                    selectedRoom === item
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedRoom === item
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Cômodo Manual */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Ou Digite um Cômodo
            </Text>
            <TextInput
              placeholder="Ex: Garagem, Sala de Jogos"
              value={customRoom}
              onChangeText={setCustomRoom}
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Tipo de Área */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Tipo de Área
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setAreaType("internal")}
                className={`flex-1 p-3 rounded-lg ${
                  areaType === "internal"
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    areaType === "internal"
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  Interno
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAreaType("external")}
                className={`flex-1 p-3 rounded-lg ${
                  areaType === "external"
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    areaType === "external"
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  Externo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botões */}
          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-300 rounded-lg py-3"
            >
              <Text className="text-center font-semibold text-gray-700">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelect}
              className="flex-1 bg-primary rounded-lg py-3"
            >
              <Text className="text-center font-semibold text-background">
                Adicionar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Modal de Foto e Legenda
function PhotoCaptionModal({
  visible,
  caption,
  onCaptionChange,
  onAddPhoto,
  onClose,
  isLoading,
}: {
  visible: boolean;
  caption: string;
  onCaptionChange: (text: string) => void;
  onAddPhoto: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-background rounded-lg w-full max-w-sm p-6 gap-4">
          <Text className="text-2xl font-bold text-foreground">
            Adicionar Foto
          </Text>

          <Text className="text-sm text-muted">
            Descreva o problema encontrado
          </Text>

          <TextInput
            placeholder="Ex: Rachadura na parede, Umidade no canto"
            value={caption}
            onChangeText={onCaptionChange}
            multiline
            numberOfLines={3}
            className="bg-surface border border-border rounded-lg p-3 text-foreground"
            placeholderTextColor="#999"
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-300 rounded-lg py-3"
            >
              <Text className="text-center font-semibold text-gray-700">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddPhoto}
              disabled={isLoading}
              className="flex-1 bg-primary rounded-lg py-3"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-background">
                  Tirar Foto
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
