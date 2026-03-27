import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection } from "@/lib/inspection-context";

export default function SummaryScreen() {
  const router = useRouter();
  const { inspection, resetInspection } = useInspection();

  const handleGeneratePDF = () => {
    alert("Funcionalidade de PDF em desenvolvimento");
  };

  const handleShareWhatsApp = () => {
    alert("Funcionalidade de WhatsApp em desenvolvimento");
  };

  const handleShareEmail = () => {
    alert("Funcionalidade de Email em desenvolvimento");
  };

  const handleFinish = () => {
    resetInspection();
    router.push("/(tabs)/");
  };

  // Calculate statistics
  const stats = {
    totalRooms: inspection?.rooms.length || 0,
    totalTests: inspection?.rooms.reduce(
      (sum, room) =>
        sum +
        room.sections.reduce((sectionSum, section) => sectionSum + section.tests.length, 0),
      0
    ) || 0,
    passedTests: inspection?.rooms.reduce(
      (sum, room) =>
        sum +
        room.sections.reduce(
          (sectionSum, section) =>
            sectionSum + section.tests.filter((t) => t.status === "pass").length,
          0
        ),
      0
    ) || 0,
    failedTests: inspection?.rooms.reduce(
      (sum, room) =>
        sum +
        room.sections.reduce(
          (sectionSum, section) =>
            sectionSum + section.tests.filter((t) => t.status === "fail").length,
          0
        ),
      0
    ) || 0,
    naTests: inspection?.rooms.reduce(
      (sum, room) =>
        sum +
        room.sections.reduce(
          (sectionSum, section) =>
            sectionSum + section.tests.filter((t) => t.status === "na").length,
          0
        ),
      0
    ) || 0,
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Resumo da Vistoria</Text>
            <Text className="text-sm text-muted text-center">
              Etapa Final - Revise e compartilhe o relatório
            </Text>
          </View>

          {/* Client Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">Cliente</Text>
            <Text className="text-base text-foreground">{inspection?.clientData.name}</Text>
            <Text className="text-sm text-muted">{inspection?.clientData.phone}</Text>
          </View>

          {/* Statistics */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Estatísticas</Text>
            <View className="grid grid-cols-2 gap-2">
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-primary">{stats.totalRooms}</Text>
                <Text className="text-xs text-muted">Cômodos</Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-primary">{stats.totalTests}</Text>
                <Text className="text-xs text-muted">Testes</Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-green-200 bg-green-50">
                <Text className="text-2xl font-bold text-green-600">{stats.passedTests}</Text>
                <Text className="text-xs text-green-700">Aprovados</Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-red-200 bg-red-50">
                <Text className="text-2xl font-bold text-red-600">{stats.failedTests}</Text>
                <Text className="text-xs text-red-700">Reprovados</Text>
              </View>
            </View>
          </View>

          {/* Rooms Summary */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Cômodos Inspecionados</Text>
            {inspection?.rooms && inspection.rooms.length > 0 ? (
              inspection.rooms.map((room) => (
                <View key={room.id} className="bg-surface rounded-lg p-3 border border-border">
                  <Text className="text-sm font-semibold text-foreground">{room.name}</Text>
                  <Text className="text-xs text-muted">
                    {room.sections.length} seções • {room.sections.reduce((sum, s) => sum + s.tests.length, 0)} testes
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-muted">Nenhum cômodo inspecionado</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Compartilhar Relatório</Text>

            <TouchableOpacity
              onPress={handleGeneratePDF}
              className="w-full bg-surface px-6 py-4 rounded-lg border border-border active:opacity-80"
            >
              <Text className="text-center font-semibold text-foreground">📄 Gerar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareWhatsApp}
              className="w-full bg-surface px-6 py-4 rounded-lg border border-border active:opacity-80"
            >
              <Text className="text-center font-semibold text-foreground">💬 Compartilhar WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareEmail}
              className="w-full bg-surface px-6 py-4 rounded-lg border border-border active:opacity-80"
            >
              <Text className="text-center font-semibold text-foreground">📧 Enviar Email</Text>
            </TouchableOpacity>
          </View>

          {/* Finish Button */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleFinish}
              className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">Finalizar Vistoria</Text>
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
