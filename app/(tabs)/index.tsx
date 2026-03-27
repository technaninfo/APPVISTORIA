import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - Seleção de Tipo de Vistoria
 * 
 * Permite ao usuário escolher entre 3 tipos de vistoria:
 * 1. Vistoria Simples (sem ART)
 * 2. Vistoria Técnica (com ART e CREA)
 * 3. Vistoria para Locação
 */
export default function HomeScreen() {
  const router = useRouter();

  const handleVistoriaSimples = () => {
    router.push({
      pathname: "/inspection/client-data",
      params: { type: "simple" },
    });
  };

  const handleVistoriaTecnica = () => {
    router.push({
      pathname: "/inspection/client-data",
      params: { type: "technical" },
    });
  };

  const handleVistoriaLocacao = () => {
    router.push({
      pathname: "/inspection/client-data",
      params: { type: "rental" },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">Check+</Text>
            <Text className="text-base text-muted text-center">
              Sistema de Vistorias Imobiliárias
            </Text>
          </View>

          {/* Vistoria Simples Card */}
          <TouchableOpacity
            onPress={handleVistoriaSimples}
            className="w-full bg-surface rounded-2xl p-6 shadow-sm border border-border active:opacity-80"
          >
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-primary">📋</Text>
              <Text className="text-xl font-semibold text-foreground">Vistoria Simples</Text>
              <Text className="text-sm text-muted text-center">
                Inspeção de imóvel sem ART
              </Text>
            </View>
          </TouchableOpacity>

          {/* Vistoria Técnica Card */}
          <TouchableOpacity
            onPress={handleVistoriaTecnica}
            className="w-full bg-surface rounded-2xl p-6 shadow-sm border border-border active:opacity-80"
          >
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-primary">🔧</Text>
              <Text className="text-xl font-semibold text-foreground">Vistoria Técnica</Text>
              <Text className="text-sm text-muted text-center">
                Inspeção com ART/CREA e parecer técnico
              </Text>
            </View>
          </TouchableOpacity>

          {/* Vistoria Locação Card */}
          <TouchableOpacity
            onPress={handleVistoriaLocacao}
            className="w-full bg-surface rounded-2xl p-6 shadow-sm border border-border active:opacity-80"
          >
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-primary">🏠</Text>
              <Text className="text-xl font-semibold text-foreground">Vistoria para Locação</Text>
              <Text className="text-sm text-muted text-center">
                Inspeção de entrada/saída de locação
              </Text>
            </View>
          </TouchableOpacity>

          {/* Info Box */}
          <View className="w-full bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Text className="text-sm text-blue-900">
              💡 <Text className="font-semibold">Dica:</Text> Escolha o tipo de vistoria que melhor se adequa ao seu caso.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
