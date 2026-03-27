import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection, type InspectionType, type ClientData } from "@/lib/inspection-context";
import { useState } from "react";

export default function ClientDataScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: InspectionType }>();
  const { setInspection } = useInspection();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const handleContinue = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Por favor, preencha nome e telefone");
      return;
    }

    const clientData: ClientData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      cpf: cpf.trim() || undefined,
    };

    // Inicializar inspeção com dados do cliente
    setInspection({
      type: type || "simple",
      clientData,
      rooms: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Navegar para próxima tela baseado no tipo
    if (type === "technical") {
      router.push("/inspection/technical-data");
    } else if (type === "rental") {
      router.push("/inspection/rental-data");
    } else {
      router.push("/inspection/conditions");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Dados do Cliente</Text>
            <Text className="text-sm text-muted text-center">
              Etapa 1 - Preencha as informações do cliente
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Nome */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Nome *</Text>
              <TextInput
                placeholder="Nome completo do cliente"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Telefone */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Telefone *</Text>
              <TextInput
                placeholder="(XX) XXXXX-XXXX"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Email */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* CPF */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">CPF</Text>
              <TextInput
                placeholder="XXX.XXX.XXX-XX"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="number-pad"
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Text className="text-xs text-blue-900">
              💡 <Text className="font-semibold">Dica:</Text> Os campos marcados com * são obrigatórios.
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
