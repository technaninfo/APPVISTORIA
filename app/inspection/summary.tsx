import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import { useState } from "react";

export default function SummaryScreen() {
  const router = useRouter();
  const { state } = useInspection();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: true,
    inspector: true,
    conditions: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFinalize = () => {
    router.push("../inspection/export");
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <Pressable onPress={() => toggleSection(section)} className="flex-row items-center justify-between py-3">
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
      <Text className="text-xl text-primary">{expandedSections[section] ? "−" : "+"}</Text>
    </Pressable>
  );

  const SectionContent = ({ children }: { children: React.ReactNode }) => (
    <View className="bg-surface rounded-lg p-4 gap-2 border border-border">{children}</View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2 border-b border-border last:border-b-0">
      <Text className="text-sm text-muted flex-1">{label}</Text>
      <Text className="text-sm font-semibold text-foreground flex-1 text-right">{value || "—"}</Text>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Resumo da Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 4 de 4</Text>
          </View>

          {/* Client Section */}
          <View className="gap-2">
            <SectionHeader title="Cliente (Contratante)" section="client" />
            {expandedSections.client && (
              <SectionContent>
                <InfoRow label="Nome" value={state.client.fullName} />
                <InfoRow label="Email" value={state.client.email} />
                <InfoRow label="Telefone" value={state.client.phone} />
                <InfoRow label="Endereço" value={state.client.address} />
                <InfoRow label="CEP" value={state.client.cep} />
              </SectionContent>
            )}
          </View>

          {/* Inspector Section */}
          <View className="gap-2">
            <SectionHeader title="Inspetor (Contratada)" section="inspector" />
            {expandedSections.inspector && (
              <SectionContent>
                <InfoRow label="Nome" value={state.inspector.name} />
                <InfoRow label="CPF/CNPJ" value={state.inspector.cpfCnpj} />
                <InfoRow label="Email" value={state.inspector.email} />
                <InfoRow label="Telefone" value={state.inspector.phone} />
                <InfoRow label="Endereço" value={state.inspector.address} />
                <InfoRow label="CEP" value={state.inspector.cep} />
                {state.type === "technical" && (
                  <>
                    <InfoRow label="CREA" value={state.inspector.crea || ""} />
                    <InfoRow label="CAU" value={state.inspector.cau || ""} />
                  </>
                )}
              </SectionContent>
            )}
          </View>

          {/* Conditions Section */}
          <View className="gap-2">
            <SectionHeader title="Condições da Vistoria" section="conditions" />
            {expandedSections.conditions && (
              <SectionContent>
                <InfoRow label="Data" value={state.conditions.date} />
                <InfoRow label="Hora" value={state.conditions.time} />
                <InfoRow
                  label="Clima"
                  value={
                    {
                      sunny: "Ensolarado",
                      cloudy: "Nublado",
                      rainy: "Chuvoso",
                      partly_cloudy: "Parcialmente nublado",
                    }[state.conditions.weather] || ""
                  }
                />
                <InfoRow
                  label="Acesso"
                  value={
                    {
                      total: "Total",
                      partial: "Parcial",
                      restricted: "Restrito",
                    }[state.conditions.access] || ""
                  }
                />
                <InfoRow
                  label="Iluminação"
                  value={
                    {
                      adequate: "Adequada",
                      partial: "Parcial",
                      insufficient: "Insuficiente",
                    }[state.conditions.lighting] || ""
                  }
                />
                <InfoRow
                  label="Ocupação"
                  value={
                    {
                      empty: "Desocupado",
                      occupied: "Ocupado",
                      under_construction: "Em obra",
                    }[state.conditions.occupancy] || ""
                  }
                />
              </SectionContent>
            )}
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton title="Finalizar Vistoria" onPress={handleFinalize} variant="success" />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
