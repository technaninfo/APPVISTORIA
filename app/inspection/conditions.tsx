import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection } from "@/lib/inspection-context";

export default function ConditionsScreen() {
  const router = useRouter();
  const { inspection } = useInspection();

  const handleStartInspection = () => {
    router.push("/inspection/room-select");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Condições da Vistoria</Text>
            <Text className="text-sm text-muted text-center">
              Etapa 3 - Verifique as condições antes de iniciar
            </Text>
          </View>

          {/* Cliente Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">Cliente</Text>
            <Text className="text-base text-foreground">{inspection?.clientData.name}</Text>
            <Text className="text-sm text-muted">{inspection?.clientData.phone}</Text>
          </View>

          {/* Tipo de Vistoria */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">Tipo de Vistoria</Text>
            <Text className="text-base text-primary font-semibold capitalize">
              {inspection?.type === "simple" && "Vistoria Simples"}
              {inspection?.type === "technical" && "Vistoria Técnica"}
              {inspection?.type === "rental" && "Vistoria para Locação"}
            </Text>
          </View>

          {/* Dados Técnicos (se aplicável) */}
          {inspection?.technicalData && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-3">Dados Técnicos</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">CREA:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.technicalData.crea}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">UF:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.technicalData.uf}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">ART:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.technicalData.art}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Dados de Locação (se aplicável) */}
          {inspection?.rentalData && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-3">Dados de Locação</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Endereço:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.rentalData.address}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Tipo:</Text>
                  <Text className="text-sm text-foreground font-semibold capitalize">
                    {inspection.rentalData.entryType === "entry" ? "Entrada" : "Saída"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Proprietário:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.rentalData.landlordName}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Inquilino:</Text>
                  <Text className="text-sm text-foreground font-semibold">
                    {inspection.rentalData.tenantName}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Info Box */}
          <View className="bg-green-50 rounded-lg p-4 border border-green-200">
            <Text className="text-xs text-green-900">
              ✓ <Text className="font-semibold">Pronto!</Text> Todos os dados foram preenchidos corretamente. Clique em "Iniciar Vistoria" para começar.
            </Text>
          </View>

          {/* Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleStartInspection}
              className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">Iniciar Vistoria</Text>
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
