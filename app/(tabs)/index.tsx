import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";

export default function HomeScreen() {
  const router = useRouter();
  const { setInspectionType } = useInspection();

  const handleTechnicalInspection = () => {
    setInspectionType("technical");
    router.push("../inspection/client-data");
  };

  const handleDeliveryInspection = () => {
    setInspectionType("delivery");
    router.push("../inspection/client-data");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Check+ Vistorias</Text>
            <Text className="text-base text-muted text-center">
              Selecione o tipo de vistoria para começar
            </Text>
          </View>

          {/* Buttons */}
          <View className="gap-4">
            <LargeButton
              title="Vistoria Técnica"
              subtitle="com ART"
              onPress={handleTechnicalInspection}
              variant="primary"
            />
            <LargeButton
              title="Entrega de Chaves"
              subtitle="sem ART"
              onPress={handleDeliveryInspection}
              variant="secondary"
            />
          </View>

          {/* Info Section */}
          <View className="mt-8 bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">ℹ️ Informações</Text>
            <Text className="text-xs text-muted leading-relaxed">
              O aplicativo funciona completamente offline. Todos os dados são armazenados localmente no seu dispositivo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
