import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { FormInput } from "@/components/form-input";
import { useInspection } from "@/lib/inspection-context";
import { useState } from "react";

export default function SummaryScreen() {
  const router = useRouter();
  const { state, updateTechnicalFinal, updateSimpleSignature } = useInspection();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: true,
    vistoriador: true,
    conditions: true,
    technicalFinal: state.type === "technical",
    simpleSignature: state.type === "simple" || state.type === "rental",
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

  const handleEditSection = (section: string) => {
    if (section === "client" || section === "vistoriador") {
      router.push("../inspection/client-data");
    } else if (section === "conditions") {
      router.push("../inspection/conditions");
    } else if (section === "items") {
      router.push("../inspection/items");
    }
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <View className="flex-row items-center justify-between py-3">
      <Pressable onPress={() => toggleSection(section)} className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          <Text className="text-xl text-primary">{expandedSections[section] ? "−" : "+"}</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => handleEditSection(section)} className="ml-2 px-3 py-1 bg-primary rounded-full">
        <Text className="text-xs font-semibold text-white">Editar</Text>
      </Pressable>
    </View>
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
                <InfoRow label="Endereço" value={`${state.client.address.street}, ${state.client.address.number} ${state.client.address.complement}`} />
                <InfoRow label="Bairro" value={state.client.address.neighborhood} />
                <InfoRow label="Cidade" value={`${state.client.address.city}, ${state.client.address.state}`} />
                <InfoRow label="CEP" value={state.client.address.cep} />
              </SectionContent>
            )}
          </View>

          {/* Inspector Section */}
          <View className="gap-2">
            <SectionHeader title="Vistoriador (Contratada)" section="vistoriador" />
            {expandedSections.vistoriador && (
              <SectionContent>
                <InfoRow label="Nome" value={state.vistoriador.name} />
                <InfoRow label="CPF/CNPJ" value={state.vistoriador.document} />
                <InfoRow label="Email" value={state.vistoriador.email} />
                <InfoRow label="Telefone" value={state.vistoriador.phone} />
                <InfoRow label="Endereço" value={`${state.vistoriador.address.street}, ${state.vistoriador.address.number} ${state.vistoriador.address.complement}`} />
                <InfoRow label="Bairro" value={state.vistoriador.address.neighborhood} />
                <InfoRow label="Cidade" value={`${state.vistoriador.address.city}, ${state.vistoriador.address.state}`} />
                <InfoRow label="CEP" value={state.vistoriador.address.cep} />
                {state.type === "technical" && (
                  <>
                    <InfoRow label="CREA" value={state.vistoriador.crea || ""} />
                    <InfoRow label="CAU" value={state.vistoriador.cau || ""} />
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

          {/* Technical Final Section (only for technical inspection) */}
          {state.type === "technical" && (
            <View className="gap-2">
              <SectionHeader title="Parecer Técnico Final" section="technicalFinal" />
              {expandedSections.technicalFinal && (
                <SectionContent>
                  <FormInput
                    label="Parecer Geral"
                    placeholder="Parecer técnico geral sobre o imóvel"
                    value={state.technicalFinal?.generalOpinion || ""}
                    onChangeText={(text) => updateTechnicalFinal({ generalOpinion: text })}
                    multiline
                    numberOfLines={3}
                  />

                  <View className="gap-2 mt-3">
                    <Text className="text-xs font-semibold text-muted uppercase">Classificação Geral</Text>
                    <View className="flex-row gap-2">
                      {[
                        { value: "adequate", label: "Adequado" },
                        { value: "with_reservations", label: "Com Ressalvas" },
                        { value: "critical", label: "Crítico" },
                      ].map((option) => (
                        <Pressable
                          key={option.value}
                          onPress={() =>
                            updateTechnicalFinal({
                              generalClassification: option.value as any,
                            })
                          }
                          className={`flex-1 py-2 px-3 rounded-lg ${
                            state.technicalFinal?.generalClassification === option.value
                              ? "bg-primary"
                              : "bg-surface border border-border"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold text-center ${
                              state.technicalFinal?.generalClassification === option.value
                                ? "text-white"
                                : "text-foreground"
                            }`}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <FormInput
                    label="Recomendações"
                    placeholder="Recomendações para o cliente"
                    value={state.technicalFinal?.recommendations || ""}
                    onChangeText={(text) => updateTechnicalFinal({ recommendations: text })}
                    multiline
                    numberOfLines={3}
                  />

                  <FormInput
                    label="Número da ART"
                    placeholder="Número da ART (Anotação de Responsabilidade Técnica)"
                    value={state.technicalFinal?.artNumber || ""}
                    onChangeText={(text) => updateTechnicalFinal({ artNumber: text })}
                  />
                </SectionContent>
              )}
            </View>
          )}

          {/* Simple Signature Section (for simple and rental inspections) */}
          {(state.type === "simple" || state.type === "rental") && (
            <View className="gap-2">
              <SectionHeader title="Assinatura e Confirmação" section="simpleSignature" />
              {expandedSections.simpleSignature && (
                <SectionContent>
                  <FormInput
                    label="Nome do Responsável"
                    placeholder="Nome de quem realizou a vistoria"
                    value={state.simpleSignature?.responsibleName || ""}
                    onChangeText={(text) => updateSimpleSignature({ responsibleName: text })}
                  />

                  <FormInput
                    label="Data de Conclusão"
                    placeholder="DD/MM/YYYY"
                    value={state.simpleSignature?.date || ""}
                    onChangeText={(text) => updateSimpleSignature({ date: text })}
                  />

                  <View className="gap-2 mt-3">
                    <Pressable
                      onPress={() =>
                        updateSimpleSignature({
                          clientAware: !state.simpleSignature?.clientAware,
                        })
                      }
                      className={`flex-row items-center gap-3 p-3 rounded-lg border ${
                        state.simpleSignature?.clientAware
                          ? "bg-success border-success"
                          : "bg-surface border-border"
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded border-2 items-center justify-center ${
                          state.simpleSignature?.clientAware
                            ? "bg-success border-success"
                            : "border-border"
                        }`}
                      >
                        {state.simpleSignature?.clientAware && (
                          <Text className="text-white font-bold">✓</Text>
                        )}
                      </View>
                      <Text className="text-sm font-semibold text-foreground">
                        Cliente ciente dos resultados
                      </Text>
                    </Pressable>
                  </View>
                </SectionContent>
              )}
            </View>
          )}

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
