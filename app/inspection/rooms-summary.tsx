import { ScrollView, View, Text, Pressable, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection, RoomChecklist } from "@/lib/inspection-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function RoomsSummaryScreen() {
  const router = useRouter();
  const { state, removeRoom, updateRoom } = useInspection();

  // Calcular status geral de cada cômodo
  const getRoomStatus = (room: RoomChecklist) => {
    const allTests = room.sections.flatMap((s) => s.tests);
    const rejected = allTests.filter((t) => t.status === "rejected").length;
    const approved = allTests.filter((t) => t.status === "approved").length;
    const pending = allTests.filter((t) => t.status === "pending").length;

    if (pending > 0) return "pending";
    if (rejected > 0) return "rejected";
    return "approved";
  };

  // Calcular estatísticas do cômodo
  const getRoomStats = (room: RoomChecklist) => {
    const allTests = room.sections.flatMap((s) => s.tests);
    return {
      total: allTests.length,
      approved: allTests.filter((t) => t.status === "approved").length,
      rejected: allTests.filter((t) => t.status === "rejected").length,
      na: allTests.filter((t) => t.status === "na").length,
      photos: allTests.reduce((acc, t) => acc + t.photos.length, 0),
    };
  };

  const handleRemoveRoom = (roomId: string, roomName: string) => {
    Alert.alert("Remover Cômodo", `Tem certeza que deseja remover "${roomName}"?`, [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Remover",
        onPress: () => {
          removeRoom(roomId);
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditRoom = (room: RoomChecklist) => {
    router.push({
      pathname: "../inspection/checklist",
      params: {
        areaType: room.areaType,
        roomName: room.roomName,
        roomId: room.id,
        isEditing: "true",
      },
    });
  };

  const RoomCard = ({ room }: { room: RoomChecklist }) => {
    const status = getRoomStatus(room);
    const stats = getRoomStats(room);

    const statusColors = {
      approved: { bg: "#f0fdf4", border: "#86efac", text: "#166534", label: "✓ Aprovado" },
      rejected: { bg: "#fef2f2", border: "#fca5a5", text: "#7f1d1d", label: "✕ Reprovado" },
      pending: { bg: "#fef3c7", border: "#fcd34d", text: "#78350f", label: "⏳ Incompleto" },
    };

    const colors = statusColors[status];

    return (
      <View
        className="mb-4 rounded-lg overflow-hidden border-2"
        style={{ borderColor: colors.border, backgroundColor: colors.bg }}
      >
        {/* Header */}
        <View className="px-4 py-3 border-b-2" style={{ borderColor: colors.border }}>
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">{room.roomName}</Text>
              <Text className="text-xs text-muted mt-1">
                {room.areaType === "internal" ? "Área Interna" : "Área Externa"}
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.border }}
            >
              <Text className="text-xs font-bold" style={{ color: colors.text }}>
                {colors.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-4 py-3 gap-2">
          <View className="flex-row justify-between gap-2">
            <View className="flex-1 bg-white rounded-lg p-2 border border-border">
              <Text className="text-xs text-muted">Total de Testes</Text>
              <Text className="text-lg font-bold text-foreground">{stats.total}</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-2 border border-border">
              <Text className="text-xs text-success">Aprovados</Text>
              <Text className="text-lg font-bold text-success">{stats.approved}</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-2 border border-border">
              <Text className="text-xs text-error">Reprovados</Text>
              <Text className="text-lg font-bold text-error">{stats.rejected}</Text>
            </View>
          </View>

          {/* Additional Info */}
          <View className="flex-row justify-between text-xs mt-2">
            <Text className="text-muted">
              {stats.na > 0 && `${stats.na} N/A`}
              {stats.photos > 0 && ` • 📷 ${stats.photos} foto(s)`}
            </Text>
          </View>

          {/* Documents */}
          {(room.memorialAvailable || room.projectAvailable) && (
            <View className="flex-row gap-2 mt-2">
              {room.memorialAvailable && (
                <View className="flex-1 bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <Text className="text-xs text-blue-900 font-semibold">📄 Memorial</Text>
                </View>
              )}
              {room.projectAvailable && (
                <View className="flex-1 bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <Text className="text-xs text-blue-900 font-semibold">📐 Projeto</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row gap-2 px-4 py-3 border-t-2" style={{ borderColor: colors.border }}>
          <Pressable
            onPress={() => handleEditRoom(room)}
            className="flex-1 bg-primary rounded-lg py-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-center text-white text-sm font-semibold">Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => handleRemoveRoom(room.id, room.roomName)}
            className="flex-1 bg-error rounded-lg py-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-center text-white text-sm font-semibold">Remover</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // Calcular estatísticas gerais
  const totalRooms = state.rooms.length;
  const approvedRooms = state.rooms.filter((r) => getRoomStatus(r) === "approved").length;
  const rejectedRooms = state.rooms.filter((r) => getRoomStatus(r) === "rejected").length;
  const incompleteRooms = state.rooms.filter((r) => getRoomStatus(r) === "pending").length;

  const allTests = state.rooms.flatMap((r) => r.sections.flatMap((s) => s.tests));
  const totalTests = allTests.length;
  const totalApproved = allTests.filter((t) => t.status === "approved").length;
  const totalRejected = allTests.filter((t) => t.status === "rejected").length;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Resumo dos Cômodos</Text>
            <Text className="text-sm text-muted">Etapa 3 de 4</Text>
          </View>

          {/* Overall Stats */}
          {totalRooms > 0 && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row justify-between gap-2">
                <View className="flex-1">
                  <Text className="text-xs text-muted">Cômodos</Text>
                  <Text className="text-2xl font-bold text-foreground">{totalRooms}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-success">Aprovados</Text>
                  <Text className="text-2xl font-bold text-success">{approvedRooms}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-error">Reprovados</Text>
                  <Text className="text-2xl font-bold text-error">{rejectedRooms}</Text>
                </View>
              </View>

              {incompleteRooms > 0 && (
                <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <Text className="text-xs text-yellow-900">
                    ⏳ {incompleteRooms} cômodo(s) incompleto(s)
                  </Text>
                </View>
              )}

              <View className="border-t border-border pt-3 mt-2">
                <View className="flex-row justify-between text-xs">
                  <Text className="text-muted">Total de testes: {totalTests}</Text>
                  <Text className="text-success">✓ {totalApproved}</Text>
                  <Text className="text-error">✕ {totalRejected}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Empty State */}
          {totalRooms === 0 && (
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-6 items-center gap-3">
              <Text className="text-2xl">📋</Text>
              <Text className="text-center text-sm text-blue-900">
                Nenhum cômodo inspecionado ainda. Clique em "Adicionar Cômodo" para começar.
              </Text>
            </View>
          )}

          {/* Rooms List */}
          {totalRooms > 0 && (
            <View>
              <Text className="text-sm font-semibold text-foreground mb-3">Cômodos Inspecionados</Text>
              {state.rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </View>
          )}

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton
              title="Adicionar Novo Cômodo"
              onPress={() => router.push("../inspection/room-selection")}
              variant="secondary"
            />
            <LargeButton
              title="Prosseguir para Finalização"
              onPress={() => router.push("../inspection/summary")}
              variant="primary"
              disabled={totalRooms === 0 || incompleteRooms > 0}
            />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
