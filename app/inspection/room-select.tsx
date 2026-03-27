import { ScrollView, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection, type Room } from "@/lib/inspection-context";
import { useState } from "react";

const ROOM_TYPES = [
  "Sala de Estar",
  "Cozinha",
  "Banheiro",
  "Quarto",
  "Lavanderia",
  "Garagem",
  "Varanda",
  "Outro",
];

export default function RoomSelectScreen() {
  const router = useRouter();
  const { inspection, addRoom } = useInspection();
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedType, setSelectedType] = useState("Outro");
  const [area, setArea] = useState("");

  const handleAddRoom = () => {
    if (!roomName.trim()) {
      alert("Por favor, preencha o nome do cômodo");
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomName.trim(),
      type: selectedType,
      area: area.trim() || undefined,
      sections: [],
    };

    addRoom(newRoom);
    setRoomName("");
    setSelectedType("Outro");
    setArea("");
    setShowModal(false);
  };

  const handleStartChecklist = () => {
    if (!inspection?.rooms || inspection.rooms.length === 0) {
      alert("Por favor, adicione pelo menos um cômodo");
      return;
    }

    router.push({
      pathname: "/inspection/checklist",
      params: { roomId: inspection.rooms[0].id },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Seleção de Cômodos</Text>
            <Text className="text-sm text-muted text-center">
              Etapa 4 - Adicione os cômodos a inspecionar
            </Text>
          </View>

          {/* Rooms List */}
          <View className="gap-3">
            {inspection?.rooms && inspection.rooms.length > 0 ? (
              inspection.rooms.map((room) => (
                <View
                  key={room.id}
                  className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{room.name}</Text>
                    <Text className="text-sm text-muted">{room.type}</Text>
                    {room.area && <Text className="text-xs text-muted">{room.area}</Text>}
                  </View>
                  <Text className="text-xl">→</Text>
                </View>
              ))
            ) : (
              <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Text className="text-sm text-blue-900">
                  💡 Nenhum cômodo adicionado ainda. Clique em "Adicionar Cômodo" para começar.
                </Text>
              </View>
            )}
          </View>

          {/* Add Room Button */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="w-full bg-surface px-6 py-4 rounded-lg border-2 border-dashed border-primary active:opacity-80"
          >
            <Text className="text-center font-semibold text-primary">+ Adicionar Cômodo</Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal visible={showModal} transparent animationType="slide">
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-background rounded-t-2xl p-6 gap-4">
                <Text className="text-2xl font-bold text-foreground">Novo Cômodo</Text>

                {/* Nome */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Nome do Cômodo *</Text>
                  <TextInput
                    placeholder="Ex: Sala 1, Quarto Principal"
                    value={roomName}
                    onChangeText={setRoomName}
                    placeholderTextColor="#999"
                    className="border border-border rounded-lg p-3 text-foreground bg-surface"
                  />
                </View>

                {/* Tipo */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Tipo de Cômodo</Text>
                  <TouchableOpacity
                    className="border border-border rounded-lg p-3 bg-surface"
                    onPress={() => {
                      // Simplified type selection - could be expanded to a picker
                    }}
                  >
                    <Text className="text-foreground">{selectedType}</Text>
                  </TouchableOpacity>
                </View>

                {/* Área */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Área (m²)</Text>
                  <TextInput
                    placeholder="Ex: 25.50"
                    value={area}
                    onChangeText={setArea}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#999"
                    className="border border-border rounded-lg p-3 text-foreground bg-surface"
                  />
                </View>

                {/* Buttons */}
                <View className="gap-2 mt-4">
                  <TouchableOpacity
                    onPress={handleAddRoom}
                    className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
                  >
                    <Text className="text-center font-semibold text-white">Adicionar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      setRoomName("");
                      setSelectedType("Outro");
                      setArea("");
                    }}
                    className="w-full bg-surface px-6 py-4 rounded-lg border border-border active:opacity-80"
                  >
                    <Text className="text-center font-semibold text-foreground">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleStartChecklist}
              className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">Iniciar Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="w-full bg-surface px-6 py-4 rounded-lg border border-border active:opacity-80"
            >
              <Text className="text-center font-semibold text-foreground">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
