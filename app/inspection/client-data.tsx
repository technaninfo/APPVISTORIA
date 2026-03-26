import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { FormInput } from "@/components/form-input";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ClientDataScreen() {
  const router = useRouter();
  const { state, updateClient, updateInspector } = useInspection();

  const handleNext = async () => {
    // Validar campos obrigatórios
    if (
      !state.client.fullName ||
      !state.client.email ||
      !state.client.phone ||
      !state.inspector.name ||
      !state.inspector.cpfCnpj ||
      !state.inspector.email ||
      !state.inspector.phone
    ) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (state.type === "technical" && (!state.inspector.crea || !state.inspector.cau)) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    router.push("../inspection/conditions");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Dados da Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 1 de 4</Text>
          </View>

          {/* Client Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Cliente (Contratante)</Text>
            <FormInput
              label="Nome Completo"
              placeholder="Ex: João Silva"
              value={state.client.fullName}
              onChangeText={(text) => updateClient({ fullName: text })}
              required
            />
            <FormInput
              label="Endereço"
              placeholder="Ex: Rua das Flores, 123"
              value={state.client.address}
              onChangeText={(text) => updateClient({ address: text })}
            />
            <FormInput
              label="CEP"
              placeholder="Ex: 12345-678"
              value={state.client.cep}
              onChangeText={(text) => updateClient({ cep: text })}
              keyboardType="numeric"
            />
            <FormInput
              label="Email"
              placeholder="Ex: joao@email.com"
              value={state.client.email}
              onChangeText={(text) => updateClient({ email: text })}
              keyboardType="email-address"
              required
            />
            <FormInput
              label="Telefone"
              placeholder="Ex: (11) 99999-9999"
              value={state.client.phone}
              onChangeText={(text) => updateClient({ phone: text })}
              keyboardType="phone-pad"
              required
            />
          </View>

          {/* Inspector Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Inspetor (Contratada)</Text>
            <FormInput
              label="Nome / Razão Social"
              placeholder="Ex: João Inspetor ou Empresa XYZ"
              value={state.inspector.name}
              onChangeText={(text) => updateInspector({ name: text })}
              required
            />
            <FormInput
              label="CPF ou CNPJ"
              placeholder="Ex: 123.456.789-00"
              value={state.inspector.cpfCnpj}
              onChangeText={(text) => updateInspector({ cpfCnpj: text })}
              keyboardType="numeric"
              required
            />
            <FormInput
              label="Endereço"
              placeholder="Ex: Rua das Flores, 456"
              value={state.inspector.address}
              onChangeText={(text) => updateInspector({ address: text })}
            />
            <FormInput
              label="CEP"
              placeholder="Ex: 12345-678"
              value={state.inspector.cep}
              onChangeText={(text) => updateInspector({ cep: text })}
              keyboardType="numeric"
            />
            <FormInput
              label="Email"
              placeholder="Ex: inspetor@email.com"
              value={state.inspector.email}
              onChangeText={(text) => updateInspector({ email: text })}
              keyboardType="email-address"
              required
            />
            <FormInput
              label="Telefone"
              placeholder="Ex: (11) 99999-9999"
              value={state.inspector.phone}
              onChangeText={(text) => updateInspector({ phone: text })}
              keyboardType="phone-pad"
              required
            />
          </View>

          {/* Technical Section (only for technical inspections) */}
          {state.type === "technical" && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Dados Técnicos</Text>
              <FormInput
                label="CREA"
                placeholder="Ex: 12345/D-SP"
                value={state.inspector.crea || ""}
                onChangeText={(text) => updateInspector({ crea: text })}
                required
              />
              <FormInput
                label="CAU"
                placeholder="Ex: 123456"
                value={state.inspector.cau || ""}
                onChangeText={(text) => updateInspector({ cau: text })}
                required
              />
            </View>
          )}

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
