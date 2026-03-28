import { View, Text, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

interface StateSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function StateSelect({ label, value, onValueChange, placeholder = "Selecione" }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="border border-border rounded-lg p-3 bg-surface"
      >
        <Text className={value ? "text-foreground" : "text-muted"}>
          {value || placeholder}
        </Text>
      </Pressable>

      {isOpen && (
        <View className="absolute top-16 left-0 right-0 bg-surface border border-border rounded-lg z-50 max-h-64">
          <ScrollView>
            {STATES.map((state) => (
              <Pressable
                key={state}
                onPress={() => {
                  onValueChange(state);
                  setIsOpen(false);
                }}
                className={`p-3 border-b border-border ${value === state ? "bg-primary" : ""}`}
              >
                <Text className={value === state ? "text-background font-semibold" : "text-foreground"}>
                  {state}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
