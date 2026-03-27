import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection, type TechnicalData } from "@/lib/inspection-context";
import { useState } from "react";

export default function TechnicalDataScreen() {
  const router = useRouter();
  const { inspection, updateTechnicalData } = useInspection();

  const [crea, setCrea] = useState("");
  const [uf, setUf] = useState("");
  const [art, setArt] = useState("");
  const [technicalOpinion, setTechnicalOpinion] = useState("");

  const handleContinue = () => {
    if (!crea.trim() || !uf.trim() || !art.trim()) {
      alert("Por favor, preencha CREA, UF e ART");
      return;
    }

    const technicalData: TechnicalData = {
      crea: crea.trim(),
      uf: uf.trim().toUpperCase(),
      art: art.trim(),
      technicalOpinion: technicalOpinion.trim(),
    };

    updateTechnicalData(technicalData);
    router.push("/inspection/conditions");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Dados Técnicos</Text>
            <Text className="text-sm text-muted text-center">
              Etapa 2 - Informações técnicas do profissional
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* CREA */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">CREA *</Text>
              <TextInput
                placeholder="Número do CREA"
                value={crea}
                onChangeText={setCrea}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* UF */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">UF *</Text>
              <TextInput
                placeholder="SP"
                value={uf}
                onChangeText={setUf}
                maxLength={2}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* ART */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">ART *</Text>
              <TextInput
                placeholder="Número da ART"
                value={art}
                onChangeText={setArt}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Parecer Técnico */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Parecer Técnico</Text>
              <TextInput
                placeholder="Observações técnicas..."
                value={technicalOpinion}
                onChangeText={setTechnicalOpinion}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Text className="text-xs text-blue-900">
              💡 <Text className="font-semibold">Dica:</Text> Preencha todos os campos obrigatórios (*).
            </Text>
          </View>

          {/* Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleContinue}
              className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">Continuar</Text>
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
