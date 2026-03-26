import { ScrollView, View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { useInspection } from "@/lib/inspection-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState, useEffect } from "react";
import { generateInspectionPDF } from "@/lib/pdf-service";
import { shareFile, shareFolder, isSharingAvailable } from "@/lib/sharing-service";
import { saveInspection } from "@/lib/storage-service";

export default function ExportScreen() {
  const router = useRouter();
  const { state, reset } = useInspection();
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<string | null>(null);

  // Salvar vistoria ao carregar a tela
  useEffect(() => {
    const saveAndPrepare = async () => {
      try {
        const saved = await saveInspection(state);
        setInspectionId(saved.id);
        setFolderPath(saved.folderPath);
      } catch (error) {
        console.error("Erro ao salvar vistoria:", error);
      }
    };
    saveAndPrepare();
  }, []);

  const handleExportPDF = async () => {
    if (!folderPath) return;
    try {
      setIsLoading(true);
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      const pdfPath = await generateInspectionPDF(state, folderPath);
      await shareFile(pdfPath, "relatorio.html");
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPhotos = async () => {
    if (!folderPath) return;
    try {
      setIsLoading(true);
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      await shareFolder(folderPath);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Erro ao exportar fotos:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareAll = async () => {
    if (!folderPath) return;
    try {
      setIsLoading(true);
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      const pdfPath = await generateInspectionPDF(state, folderPath);
      await shareFile(pdfPath, "relatorio.html");
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackHome = () => {
    reset();
    router.push("/(tabs)");
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-foreground">Processando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Exportar Vistoria</Text>
            <Text className="text-sm text-muted">Finalize compartilhando os dados</Text>
          </View>

          {/* Success Message */}
          <View className="bg-success/10 border border-success rounded-2xl p-4">
            <Text className="text-sm font-semibold text-success">✓ Vistoria Finalizada</Text>
            <Text className="text-xs text-success/80 mt-1">
              Todos os dados foram salvos localmente no seu dispositivo.
            </Text>
          </View>

          {/* Export Options */}
          <View className="gap-4">
            <LargeButton
              title="Exportar PDF"
              subtitle="Gerar relatório completo"
              onPress={handleExportPDF}
              variant="primary"
            />
            <LargeButton
              title="Exportar Fotos"
              subtitle="Pacote com metadados"
              onPress={handleExportPhotos}
              variant="secondary"
            />
            <LargeButton
              title="Compartilhar Tudo"
              subtitle="Via WhatsApp, Drive, Email..."
              onPress={handleShareAll}
              variant="secondary"
            />
          </View>

          {/* Info Section */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">📁 Armazenamento</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Todos os dados estão salvos em: vistoria_tipo_nomecliente_data
            </Text>
          </View>

          {/* Navigation */}
          <View className="gap-3 mt-4">
            <LargeButton title="Voltar ao Início" onPress={handleBackHome} variant="primary" />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Editar Vistoria</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
