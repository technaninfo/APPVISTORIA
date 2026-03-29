import { ScrollView, View, Text, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { FormInput } from "@/components/form-input";
import { useInspection } from "@/lib/inspection-context";
import { useState } from "react";
import { INTERNAL_CHECKLIST, EXTERNAL_CHECKLIST } from "@/lib/checklist-data";

export default function ItemsScreen() {
  const router = useRouter();
  const { state, updateItem } = useInspection();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Usar checklist baseado no tipo de vistoria
  const checklist = INTERNAL_CHECKLIST;

  const handleNext = () => {
    router.push("../inspection/summary");
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleStatusChange = (itemId: string, status: "approved" | "rejected" | "na") => {
    updateItem(itemId, { status });
  };

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    const updates: any = {};
    updates[field] = value;
    updateItem(itemId, updates);
  };

  const isTechnical = state.type === "technical";
  const isRental = state.type === "rental";

  const StatusButton = ({ itemId, status }: { itemId: string; status: string }) => (
    <View className="flex-row gap-2">
      <Pressable
        onPress={() => handleStatusChange(itemId, "approved")}
        className={`flex-1 py-2 px-3 rounded-lg ${
          status === "approved" ? "bg-success" : "bg-surface border border-border"
        }`}
      >
        <Text className={`text-xs font-semibold text-center ${status === "approved" ? "text-white" : "text-foreground"}`}>
          ✓ Aprovado
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleStatusChange(itemId, "rejected")}
        className={`flex-1 py-2 px-3 rounded-lg ${
          status === "rejected" ? "bg-error" : "bg-surface border border-border"
        }`}
      >
        <Text className={`text-xs font-semibold text-center ${status === "rejected" ? "text-white" : "text-foreground"}`}>
          ✗ Reprovado
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleStatusChange(itemId, "na")}
        className={`flex-1 py-2 px-3 rounded-lg ${
          status === "na" ? "bg-muted" : "bg-surface border border-border"
        }`}
      >
        <Text className={`text-xs font-semibold text-center ${status === "na" ? "text-white" : "text-foreground"}`}>
          — N/A
        </Text>
      </Pressable>
    </View>
  );

  const ItemCard = ({ item }: { item: any }) => {
    const isExpanded = expandedItems[item.id];
    const itemData = state.items.find((i) => i.id === item.id) || item;

    return (
      <View key={item.id} className="bg-surface rounded-lg border border-border overflow-hidden mb-3">
        <Pressable
          onPress={() => toggleItem(item.id)}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground">{item.description}</Text>
            <Text className="text-xs text-muted mt-1">
              Status: {itemData.status === "approved" ? "✓ Aprovado" : itemData.status === "rejected" ? "✗ Reprovado" : "— N/A"}
            </Text>
          </View>
          <Text className="text-lg text-primary ml-2">{isExpanded ? "−" : "+"}</Text>
        </Pressable>

        {isExpanded && (
          <View className="px-4 pb-4 gap-3 border-t border-border pt-4">
            {/* Status Selection */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">Status</Text>
              <StatusButton itemId={item.id} status={itemData.status} />
            </View>

            {/* Technical Fields (only for technical inspection) */}
            {isTechnical && (
              <>
                <FormInput
                  label="Teste Técnico"
                  placeholder="Descreva o teste realizado"
                  value={itemData.technicalTest || ""}
                  onChangeText={(text) => handleFieldChange(item.id, "technicalTest", text)}
                  multiline
                  numberOfLines={2}
                />

                <FormInput
                  label="Parecer Técnico"
                  placeholder="Parecer sobre o resultado"
                  value={itemData.technicalOpinion || ""}
                  onChangeText={(text) => handleFieldChange(item.id, "technicalOpinion", text)}
                  multiline
                  numberOfLines={2}
                />

                {/* Classification (only when rejected) */}
                {itemData.status === "rejected" && (
                  <View className="gap-2">
                    <Text className="text-xs font-semibold text-muted uppercase">Classificação</Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => handleFieldChange(item.id, "classification", "light")}
                        className={`flex-1 py-2 px-3 rounded-lg ${
                          itemData.classification === "light" ? "bg-warning" : "bg-surface border border-border"
                        }`}
                      >
                        <Text className={`text-xs font-semibold text-center ${itemData.classification === "light" ? "text-white" : "text-foreground"}`}>
                          Leve
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleFieldChange(item.id, "classification", "moderate")}
                        className={`flex-1 py-2 px-3 rounded-lg ${
                          itemData.classification === "moderate" ? "bg-warning" : "bg-surface border border-border"
                        }`}
                      >
                        <Text className={`text-xs font-semibold text-center ${itemData.classification === "moderate" ? "text-white" : "text-foreground"}`}>
                          Moderado
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleFieldChange(item.id, "classification", "critical")}
                        className={`flex-1 py-2 px-3 rounded-lg ${
                          itemData.classification === "critical" ? "bg-error" : "bg-surface border border-border"
                        }`}
                      >
                        <Text className={`text-xs font-semibold text-center ${itemData.classification === "critical" ? "text-white" : "text-foreground"}`}>
                          Crítico
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Rental Fields (only for rental inspection) */}
            {isRental && (
              <>
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-muted uppercase">Estado</Text>
                  <View className="flex-row gap-2">
                    {["new", "good", "regular", "poor"].map((condition) => (
                      <Pressable
                        key={condition}
                        onPress={() => handleFieldChange(item.id, "condition", condition)}
                        className={`flex-1 py-2 px-2 rounded-lg ${
                          itemData.condition === condition ? "bg-primary" : "bg-surface border border-border"
                        }`}
                      >
                        <Text className={`text-xs font-semibold text-center ${itemData.condition === condition ? "text-white" : "text-foreground"}`}>
                          {condition === "new" ? "Novo" : condition === "good" ? "Bom" : condition === "regular" ? "Regular" : "Ruim"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <FormInput
                  label="Descrição"
                  placeholder="Descreva o estado do item"
                  value={itemData.description || ""}
                  onChangeText={(text) => handleFieldChange(item.id, "description", text)}
                  multiline
                  numberOfLines={2}
                />
              </>
            )}

            {/* General Description */}
            {!isRental && (
              <FormInput
                label="Observações"
                placeholder="Adicione observações se necessário"
                value={itemData.description || ""}
                onChangeText={(text) => handleFieldChange(item.id, "description", text)}
                multiline
                numberOfLines={2}
              />
            )}
          </View>
        )}
      </View>
    );
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

          {/* Items List */}
          <View className="gap-2">
            {checklist.map((section) => (
              <View key={section.id} className="gap-3">
                <Text className="text-lg font-semibold text-foreground mt-4">{section.title}</Text>
                {section.tests.map((test) => (
                  <ItemCard key={test.id} item={test} />
                ))}
              </View>
            ))}
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-6">
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
