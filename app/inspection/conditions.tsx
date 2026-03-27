import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { SegmentedControl } from "@/components/segmented-control";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ConditionsScreen() {
  const router = useRouter();
  const { state, updateConditions } = useInspection();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      updateConditions({ date: dateString });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      updateConditions({ time: timeString });
    }
  };

  const handleNext = async () => {
    if (!state.conditions.date || !state.conditions.time) {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.push("../inspection/items");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Condições da Vistoria</Text>
            <Text className="text-sm text-muted">Etapa 2 de 4</Text>
          </View>

          {/* Date and Time */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Data da Vistoria *</Text>
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={state.conditions.date || ""}
                  onChange={(e) => updateConditions({ date: e.target.value })}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                />
              ) : (
                <>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="bg-surface border border-border rounded-lg p-3"
                  >
                    <Text className="text-base text-foreground">
                      {state.conditions.date || "Selecione uma data"}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={state.conditions.date ? new Date(state.conditions.date) : new Date()}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                    />
                  )}
                </>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Hora da Vistoria *</Text>
              {Platform.OS === "web" ? (
                <input
                  type="time"
                  value={state.conditions.time || ""}
                  onChange={(e) => updateConditions({ time: e.target.value })}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                />
              ) : (
                <>
                  <Pressable
                    onPress={() => setShowTimePicker(true)}
                    className="bg-surface border border-border rounded-lg p-3"
                  >
                    <Text className="text-base text-foreground">
                      {state.conditions.time || "Selecione uma hora"}
                    </Text>
                  </Pressable>
                  {showTimePicker && (
                    <DateTimePicker
                      value={state.conditions.time ? new Date(`2000-01-01T${state.conditions.time}`) : new Date()}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                    />
                  )}
                </>
              )}
            </View>
          </View>

          {/* Weather */}
          <SegmentedControl
            label="Condições Climáticas"
            options={["Ensolarado", "Nublado", "Chuvoso", "Parcialmente nublado"]}
            selectedValue={
              {
                sunny: "Ensolarado",
                cloudy: "Nublado",
                rainy: "Chuvoso",
                partly_cloudy: "Parcialmente nublado",
              }[state.conditions.weather] || "Ensolarado"
            }
            onValueChange={(value) => {
              const weatherMap: Record<string, "sunny" | "cloudy" | "rainy" | "partly_cloudy"> = {
                "Ensolarado": "sunny",
                "Nublado": "cloudy",
                "Chuvoso": "rainy",
                "Parcialmente nublado": "partly_cloudy",
              };
              updateConditions({ weather: weatherMap[value] });
            }}
          />

          {/* Access */}
          <SegmentedControl
            label="Condições de Acesso"
            options={["Total", "Parcial", "Restrito"]}
            selectedValue={
              {
                total: "Total",
                partial: "Parcial",
                restricted: "Restrito",
              }[state.conditions.access] || "Total"
            }
            onValueChange={(value) => {
              const accessMap: Record<string, "total" | "partial" | "restricted"> = {
                "Total": "total",
                "Parcial": "partial",
                "Restrito": "restricted",
              };
              updateConditions({ access: accessMap[value] });
            }}
          />

          {/* Lighting */}
          <SegmentedControl
            label="Iluminação"
            options={["Adequada", "Parcial", "Insuficiente"]}
            selectedValue={
              {
                adequate: "Adequada",
                partial: "Parcial",
                insufficient: "Insuficiente",
              }[state.conditions.lighting] || "Adequada"
            }
            onValueChange={(value) => {
              const lightingMap: Record<string, "adequate" | "partial" | "insufficient"> = {
                "Adequada": "adequate",
                "Parcial": "partial",
                "Insuficiente": "insufficient",
              };
              updateConditions({ lighting: lightingMap[value] });
            }}
          />

          {/* Occupancy */}
          <SegmentedControl
            label="Ocupação"
            options={["Desocupado", "Ocupado", "Em obra"]}
            selectedValue={
              {
                empty: "Desocupado",
                occupied: "Ocupado",
                under_construction: "Em obra",
              }[state.conditions.occupancy] || "Desocupado"
            }
            onValueChange={(value) => {
              const occupancyMap: Record<string, "empty" | "occupied" | "under_construction"> = {
                "Desocupado": "empty",
                "Ocupado": "occupied",
                "Em obra": "under_construction",
              };
              updateConditions({ occupancy: occupancyMap[value] });
            }}
          />

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
