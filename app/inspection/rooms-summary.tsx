import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection } from "@/lib/inspection-context";
import { Button } from "@/components/button";
import { useColors } from "@/hooks/use-colors";

export default function RoomsSummaryScreen() {
  const router = useRouter();
  const { state, removeRoom } = useInspection();
  const colors = useColors();

  const handleRemoveRoom = (roomId: string) => {
    Alert.alert("Remover Cômodo", "Tem certeza que deseja remover este cômodo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeRoom(roomId),
      },
    ]);
  };

  const handleAddRoom = () => {
    router.push("/inspection/room-selection");
  };

  const handleEditRoom = (roomId: string) => {
    router.push({
      pathname: "/inspection/checklist",
      params: { roomId },
    });
  };

  const handleContinue = () => {
    if (state.rooms.length === 0) {
      Alert.alert("Aviso", "Adicione pelo menos um cômodo para continuar");
      return;
    }
    router.push("/inspection/summary");
  };

  const calculateRoomStatus = (roomId: string) => {
    const room = state.rooms.find((r) => r.id === roomId);
    if (!room) return "Pendente";

    const totalTests = room.sections.reduce((sum, section) => sum + section.tests.length, 0);
    const completedTests = room.sections.reduce(
      (sum, section) =>
        sum +
        section.tests.filter((test) => test.status !== "pending").length,
      0
    );

    if (completedTests === 0) return "Não iniciado";
    if (completedTests === totalTests) return "Completo";
    return `${completedTests}/${totalTests}`;
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Cômodos da Vistoria</Text>
            <Text className="text-base text-muted">
              {state.rooms.length} cômodo{state.rooms.length !== 1 ? "s" : ""} adicionado{state.rooms.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Rooms List */}
          {state.rooms.length > 0 ? (
            <View className="gap-3">
              {state.rooms.map((room) => (
                <View
                  key={room.id}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="gap-3">
                    {/* Room Header */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1 gap-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {room.roomName}
                        </Text>
                        <Text className="text-sm text-muted">
                          {room.areaType === "internal" ? "Área Interna" : "Área Externa"}
                        </Text>
                      </View>
                      <View className="bg-primary rounded-full px-3 py-1">
                        <Text className="text-xs font-semibold text-background">
                          {calculateRoomStatus(room.id)}
                        </Text>
                      </View>
                    </View>

                    {/* Room Info */}
                    <View className="flex-row gap-4">
                      <View className="flex-1">
                        <Text className="text-xs text-muted mb-1">Seções</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {room.sections.length}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-muted mb-1">Testes</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {room.sections.reduce((sum, s) => sum + s.tests.length, 0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-muted mb-1">Fotos</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {room.sections.reduce(
                            (sum, s) =>
                              sum +
                              s.tests.reduce((tsum, t) => tsum + t.photos.length, 0),
                            0
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-2 pt-2">
                      <TouchableOpacity
                        onPress={() => handleEditRoom(room.id)}
                        className="flex-1 bg-primary rounded-lg py-2"
                      >
                        <Text className="text-center text-sm font-semibold text-background">
                          Editar
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveRoom(room.id)}
                        className="flex-1 bg-error rounded-lg py-2"
                      >
                        <Text className="text-center text-sm font-semibold text-background">
                          Remover
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-surface rounded-xl p-6 items-center gap-3 border border-border">
              <Text className="text-base text-muted text-center">
                Nenhum cômodo adicionado ainda
              </Text>
            </View>
          )}

          {/* Add Room Button */}
          <Button
            title="+ Adicionar Cômodo"
            onPress={handleAddRoom}
            variant="secondary"
          />

          {/* Continue Button */}
          <Button
            title="Continuar para Resumo"
            onPress={handleContinue}
            variant="primary"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
