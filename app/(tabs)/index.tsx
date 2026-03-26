import { ScrollView, View, Text, ActivityIndicator, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { HistoryCard } from "@/components/history-card";
import { useInspection } from "@/lib/inspection-context";
import { getInspectionsList } from "@/lib/storage-service";

export default function HomeScreen() {
  const router = useRouter();
  const { setInspectionType } = useInspection();
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadInspections();
    }, [])
  );

  const loadInspections = async () => {
    try {
      setIsLoading(true);
      const list = await getInspectionsList();
      // Ordenar por data mais recente primeiro
      const sorted = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInspections(sorted);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechnicalInspection = () => {
    setInspectionType("technical");
    router.push("../inspection/client-data");
  };

  const handleDeliveryInspection = () => {
    setInspectionType("delivery");
    router.push("../inspection/client-data");
  };

  const handleOpenInspection = (id: string) => {
    // Navegar para tela de visualização de vistoria
    router.push({
      pathname: "../inspection/view-inspection",
      params: { id },
    });
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header com Logo */}
          <View className="bg-gradient-to-b from-primary to-primary/80 px-6 pt-8 pb-6 items-center gap-3">
            <Image
              source={require("@/assets/images/logo-vector.png")}
              style={{ width: 200, height: 60, resizeMode: "contain" }}
            />
            <Text className="text-sm text-white/90 text-center font-medium">
              Sistema de Vistorias Imobiliárias
            </Text>
          </View>

          {/* Content */}
          <View className="px-6 pt-6 gap-6 flex-1">
            {/* Subtitle */}
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">Bem-vindo</Text>
              <Text className="text-sm text-muted">
                Selecione o tipo de vistoria para começar
              </Text>
            </View>

            {/* Buttons */}
            <View className="gap-3">
              <LargeButton
                title="Vistoria Técnica"
                subtitle="com ART/CREA/CAU"
                onPress={handleTechnicalInspection}
                variant="primary"
                icon={require("@/assets/images/icon.png")}
                iconSize={56}
              />
              <LargeButton
                title="Entrega de Chaves"
                subtitle="Inspeção de Imóvel"
                onPress={handleDeliveryInspection}
                variant="secondary"
                icon={require("@/assets/images/icon.png")}
                iconSize={56}
              />
            </View>

            {/* Info Section */}
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-200 gap-2">
              <Text className="text-sm font-semibold text-blue-900">💡 Modo Offline</Text>
              <Text className="text-xs text-blue-800 leading-relaxed">
                O aplicativo funciona completamente offline. Todos os dados são armazenados localmente no seu dispositivo.
              </Text>
            </View>

            {/* History Section */}
            {isLoading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" />
              </View>
            ) : inspections.length > 0 ? (
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-foreground">Histórico</Text>
                  <Text className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                    {inspections.length}
                  </Text>
                </View>
                {inspections.map((inspection) => (
                  <HistoryCard
                    key={inspection.id}
                    type={inspection.type}
                    clientName={inspection.clientName}
                    date={new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
                    onPress={() => handleOpenInspection(inspection.id)}
                  />
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-12">
                <Text className="text-4xl mb-2">📋</Text>
                <Text className="text-muted text-center font-medium">Nenhuma vistoria realizada ainda</Text>
                <Text className="text-xs text-muted text-center mt-1">Comece criando uma nova vistoria</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
