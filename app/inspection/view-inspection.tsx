import { ScrollView, View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateInspectionPDF } from "@/lib/pdf-service";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

interface Inspection {
  id: string;
  type: string;
  client: any;
  vistoriador: any;
  conditions: any;
  rooms: any[];
  status: string;
  createdAt: string;
}

export default function ViewInspectionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    try {
      setIsLoading(true);
      if (!id) return;

      const key = `inspection_${id}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setInspection(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar vistoria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInspection = () => {
    // TODO: Implementar edição de vistoria
    console.log("Editar vistoria:", id);
  };

  const handleExportPDF = async () => {
    if (!inspection) return;
    try {
      // Usar caminho temporário para o PDF
      const pdfPath = await generateInspectionPDF(inspection as any, "/tmp");
      if (pdfPath && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(pdfPath);
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!inspection) {
    return (
      <ScreenContainer className="items-center justify-center gap-4">
        <Text className="text-lg font-semibold text-foreground">Vistoria não encontrada</Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Voltar</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Detalhes da Vistoria</Text>
            <Text className="text-sm text-muted">
              {new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
            </Text>
          </View>

          {/* Cliente */}
          <View className="gap-3 bg-surface rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground">Cliente</Text>
            <View className="gap-2">
              <View>
                <Text className="text-xs text-muted font-semibold">Nome</Text>
                <Text className="text-sm text-foreground">
                  {inspection.client.fullName || inspection.client.razaoSocial || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-muted font-semibold">CPF/CNPJ</Text>
                <Text className="text-sm text-foreground">
                  {inspection.client.cpf || inspection.client.cnpj || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-muted font-semibold">Email</Text>
                <Text className="text-sm text-foreground">{inspection.client.email || "N/A"}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted font-semibold">Telefone</Text>
                <Text className="text-sm text-foreground">{inspection.client.phone || "N/A"}</Text>
              </View>
            </View>
          </View>

          {/* Vistoriador */}
          <View className="gap-3 bg-surface rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground">Vistoriador</Text>
            <View className="gap-2">
              <View>
                <Text className="text-xs text-muted font-semibold">Nome</Text>
                <Text className="text-sm text-foreground">{inspection.vistoriador.name || "N/A"}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted font-semibold">CPF/CNPJ</Text>
                <Text className="text-sm text-foreground">
                  {inspection.vistoriador.document || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-muted font-semibold">Email</Text>
                <Text className="text-sm text-foreground">
                  {inspection.vistoriador.email || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Condições */}
          <View className="gap-3 bg-surface rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground">Condições da Vistoria</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-xs text-muted font-semibold">Data</Text>
                  <Text className="text-sm text-foreground">{inspection.conditions.date}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted font-semibold">Hora</Text>
                  <Text className="text-sm text-foreground">{inspection.conditions.time}</Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-xs text-muted font-semibold">Clima</Text>
                  <Text className="text-sm text-foreground">{inspection.conditions.weather}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted font-semibold">Acesso</Text>
                  <Text className="text-sm text-foreground">{inspection.conditions.access}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cômodos */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Cômodos Vistoriados</Text>
            {inspection.rooms.map((room) => (
              <View key={room.id} className="bg-surface rounded-lg p-4 gap-2">
                <Text className="font-semibold text-foreground">{room.name}</Text>
                <Text className="text-xs text-muted">
                  {room.areaType === "internal" ? "Área Interna" : "Área Externa"}
                </Text>
                <Text className="text-xs text-muted">
                  {room.items.length} itens • {room.items.filter((i: any) => i.status === "approved").length} aprovados
                </Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View className="gap-3 pt-4">
            <LargeButton
              title="Editar Vistoria"
              subtitle="Modificar dados da vistoria"
              onPress={handleEditInspection}
              variant="primary"
            />
            <LargeButton
              title="Exportar PDF"
              subtitle="Baixar relatório em PDF"
              onPress={handleExportPDF}
              variant="secondary"
            />
            <Pressable
              onPress={() => router.back()}
              className="bg-surface border border-border rounded-lg p-4 items-center"
            >
              <Text className="text-foreground font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
