import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection, type RentalData } from "@/lib/inspection-context";
import { useState } from "react";

export default function RentalDataScreen() {
  const router = useRouter();
  const { inspection, updateRentalData } = useInspection();

  const [address, setAddress] = useState("");
  const [entryType, setEntryType] = useState<"entry" | "exit">("entry");
  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [realEstateAgency, setRealEstateAgency] = useState("");

  const handleContinue = () => {
    if (!address.trim() || !landlordName.trim() || !tenantName.trim()) {
      alert("Por favor, preencha endereço, proprietário e inquilino");
      return;
    }

    const rentalData: RentalData = {
      address: address.trim(),
      entryType,
      landlordName: landlordName.trim(),
      landlordPhone: landlordPhone.trim(),
      tenantName: tenantName.trim(),
      tenantPhone: tenantPhone.trim(),
      realEstateAgency: realEstateAgency.trim() || undefined,
    };

    updateRentalData(rentalData);
    router.push("/inspection/conditions");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Dados de Locação</Text>
            <Text className="text-sm text-muted text-center">
              Etapa 2 - Informações de entrada/saída
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Endereço */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Endereço *</Text>
              <TextInput
                placeholder="Rua, número, complemento"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Tipo de Vistoria */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Tipo de Vistoria *</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setEntryType("entry")}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    entryType === "entry"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      entryType === "entry" ? "text-white" : "text-foreground"
                    }`}
                  >
                    Entrada
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEntryType("exit")}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    entryType === "exit"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      entryType === "exit" ? "text-white" : "text-foreground"
                    }`}
                  >
                    Saída
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Proprietário */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Proprietário *</Text>
              <TextInput
                placeholder="Nome do proprietário"
                value={landlordName}
                onChangeText={setLandlordName}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Telefone Proprietário */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Telefone Proprietário</Text>
              <TextInput
                placeholder="(XX) XXXXX-XXXX"
                value={landlordPhone}
                onChangeText={setLandlordPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Inquilino */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Inquilino *</Text>
              <TextInput
                placeholder="Nome do inquilino"
                value={tenantName}
                onChangeText={setTenantName}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Telefone Inquilino */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Telefone Inquilino</Text>
              <TextInput
                placeholder="(XX) XXXXX-XXXX"
                value={tenantPhone}
                onChangeText={setTenantPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>

            {/* Imobiliária */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Imobiliária</Text>
              <TextInput
                placeholder="Nome da imobiliária (opcional)"
                value={realEstateAgency}
                onChangeText={setRealEstateAgency}
                placeholderTextColor="#999"
                className="border border-border rounded-lg p-3 text-foreground bg-surface"
              />
            </View>
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
