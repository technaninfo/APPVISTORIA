import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";

export default function ItemsScreen() {
  const router = useRouter();
  const { state } = useInspection();

  const handleNext = () => {
    // Redirecionar para seleção de cômodo (checklist dinâmico)
    router.push("../inspection/room-selection");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Itens de Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 3 de 4</Text>
          </View>

          {/* Info Section */}
          <View className="flex-1 items-center justify-center gap-4">
            <View className="w-16 h-16 bg-surface rounded-full items-center justify-center border border-border">
              <Text className="text-2xl">✓</Text>
            </View>
            <View className="items-center gap-2">
              <Text className="text-lg font-semibold text-foreground text-center">
                Inspeção de Cômodos
              </Text>
              <Text className="text-sm text-muted text-center leading-relaxed">
                Agora você vai inspecionar cada cômodo do imóvel. Selecione o tipo de área (interna/externa) e o cômodo para começar o checklist.
              </Text>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xs text-muted leading-relaxed">
              ℹ️ Para cada cômodo, você poderá marcar testes como Aprovado (✓), Reprovado (✕) ou Não Aplicável (NA), além de adicionar fotos e descrições.
            </Text>
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton title="Próximo" onPress={handleNext} variant="primary" />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
