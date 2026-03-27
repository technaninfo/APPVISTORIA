import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";

interface AddCustomItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (itemName: string, testDescription: string) => void;
  isLoading?: boolean;
}

export function AddCustomItemModal({
  visible,
  onClose,
  onAdd,
  isLoading = false,
}: AddCustomItemModalProps) {
  const [itemName, setItemName] = useState("");
  const [testDescription, setTestDescription] = useState("");

  const handleAdd = () => {
    if (!itemName.trim() || !testDescription.trim()) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert("Preencha o nome do item e a descrição do teste");
      return;
    }

    onAdd(itemName.trim(), testDescription.trim());
    setItemName("");
    setTestDescription("");

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleClose = () => {
    setItemName("");
    setTestDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-4 pt-12">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Adicionar Item Customizado</Text>
            <Pressable onPress={handleClose}>
              <Text className="text-white text-lg">✕</Text>
            </Pressable>
          </View>
          <Text className="text-white/80 text-sm mt-2">
            Crie um novo item de vistoria com teste customizado
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          <View className="gap-6">
            {/* Item Name */}
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Nome do Item</Text>
              <TextInput
                placeholder="Ex: Pintura, Vidraçaria, Piso..."
                value={itemName}
                onChangeText={setItemName}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                editable={!isLoading}
                maxLength={50}
              />
              <Text className="text-xs text-muted">{itemName.length}/50 caracteres</Text>
            </View>

            {/* Test Description */}
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Descrição do Teste</Text>
              <TextInput
                placeholder="Ex: Verificar se há trincas ou danos..."
                value={testDescription}
                onChangeText={setTestDescription}
                className="border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                editable={!isLoading}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              <Text className="text-xs text-muted">{testDescription.length}/200 caracteres</Text>
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Text className="text-xs text-blue-900">
                ℹ️ Este item será adicionado à seção "Itens Customizados" do checklist. Você poderá
                marcar como Aprovado, Reprovado ou Não Aplicável e adicionar fotos se necessário.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View className="border-t border-border px-6 py-4 gap-3 bg-background">
          <Pressable
            onPress={handleAdd}
            disabled={isLoading || !itemName.trim() || !testDescription.trim()}
            style={({ pressed }) => [
              {
                opacity:
                  pressed || isLoading || !itemName.trim() || !testDescription.trim() ? 0.7 : 1,
                backgroundColor:
                  !itemName.trim() || !testDescription.trim() ? "#d1d5db" : "#10B981",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">+ Adicionar Item</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleClose}
            disabled={isLoading}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-center text-primary font-semibold">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
