import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { LargeButton } from "@/components/large-button";
import { PhotoCaptureModal } from "@/components/photo-capture-modal";
import { INTERNAL_CHECKLIST, EXTERNAL_CHECKLIST, AreaType, TestStatus, ChecklistSection, TestItem, PhotoWithCaption } from "@/lib/checklist-data";
import { useInspection } from "@/lib/inspection-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ChecklistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addRoom } = useInspection();
  const areaType = (params.areaType as AreaType) || "internal";
  const roomName = (Array.isArray(params.roomName) ? params.roomName[0] : params.roomName) || "Cômodo";

  const [sections, setSections] = useState<ChecklistSection[]>(
    areaType === "internal" ? INTERNAL_CHECKLIST : EXTERNAL_CHECKLIST
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [memorialAvailable, setMemorialAvailable] = useState(false);
  const [projectAvailable, setProjectAvailable] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedTestForPhoto, setSelectedTestForPhoto] = useState<{ sectionId: string; testId: string } | null>(null);

  // Verificar se todos os testes foram preenchidos
  const allTestsFilled = sections.every((section) =>
    section.tests.every((test) => test.status !== "pending")
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const updateTestStatus = (sectionId: string, testId: string, status: TestStatus) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tests: section.tests.map((test) =>
                test.id === testId ? { ...test, status } : test
              ),
            }
          : section
      )
    );

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePhotoSave = (photos: PhotoWithCaption[]) => {
    if (!selectedTestForPhoto) return;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === selectedTestForPhoto.sectionId
          ? {
              ...section,
              tests: section.tests.map((test) =>
                test.id === selectedTestForPhoto.testId
                  ? { ...test, photos }
                  : test
              ),
            }
          : section
      )
    );

    setSelectedTestForPhoto(null);
    setPhotoModalVisible(false);
  };

  const TestRow = ({ test, sectionId }: { test: TestItem; sectionId: string }) => (
    <View className="mb-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Text className="text-sm text-foreground">{test.description}</Text>
        </View>

        {/* Status Buttons */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => updateTestStatus(sectionId, test.id, "approved")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: test.status === "approved" ? "#10B981" : "#f5f5f5",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: test.status === "approved" ? "#10B981" : "#e5e7eb",
              },
            ]}
          >
            <Text
              style={{
                color: test.status === "approved" ? "white" : "#666",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              ✓
            </Text>
          </Pressable>

          <Pressable
            onPress={() => updateTestStatus(sectionId, test.id, "rejected")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: test.status === "rejected" ? "#EF4444" : "#f5f5f5",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: test.status === "rejected" ? "#EF4444" : "#e5e7eb",
              },
            ]}
          >
            <Text
              style={{
                color: test.status === "rejected" ? "white" : "#666",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              ✕
            </Text>
          </Pressable>

          <Pressable
            onPress={() => updateTestStatus(sectionId, test.id, "na")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: test.status === "na" ? "#9CA3AF" : "#f5f5f5",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: test.status === "na" ? "#9CA3AF" : "#e5e7eb",
              },
            ]}
          >
            <Text
              style={{
                color: test.status === "na" ? "white" : "#666",
                fontSize: 10,
                fontWeight: "600",
              }}
            >
              NA
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Photo section for rejected tests */}
      {test.status === "rejected" && (
        <View className="mt-2 ml-0">
          {test.photos.length > 0 && (
            <Text className="text-xs text-success mb-2">📷 {test.photos.length} foto(s) anexada(s)</Text>
          )}
          <Pressable
            onPress={() => {
              setSelectedTestForPhoto({ sectionId, testId: test.id });
              setPhotoModalVisible(true);
            }}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
              backgroundColor: "#f0f9ff",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: "#0a7ea4",
            }]}
          >
            <Text className="text-xs text-primary font-semibold">+ Adicionar Foto</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const SectionComponent = ({ section }: { section: ChecklistSection }) => {
    const isExpanded = expandedSections[section.id];
    const allTestsInSectionFilled = section.tests.every((test) => test.status !== "pending");

    return (
      <View className="mb-4 border border-border rounded-lg overflow-hidden bg-surface">
        <Pressable
          onPress={() => toggleSection(section.id)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: allTestsInSectionFilled ? "#f0fdf4" : "#fafafa",
              borderBottomWidth: isExpanded ? 1 : 0,
              borderBottomColor: "#e5e7eb",
            },
          ]}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{section.title}</Text>
              <Text className="text-xs text-muted mt-1">
                {section.tests.filter((t) => t.status !== "pending").length}/{section.tests.length} testes
              </Text>
            </View>
            <Text className="text-lg text-primary">{isExpanded ? "−" : "+"}</Text>
          </View>
        </Pressable>

        {isExpanded && (
          <View className="px-4 py-3 gap-3">
            {section.tests.map((test) => (
              <TestRow key={test.id} test={test} sectionId={section.id} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Checklist</Text>
            <Text className="text-sm text-muted">
              {areaType === "internal" ? "Área Interna" : "Área Externa"} - {String(roomName)}
            </Text>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Text className="text-xs text-blue-900">
              ℹ️ Clique nos botões para marcar cada teste: ✓ (Aprovado), ✕ (Reprovado), NA (Não Aplicável)
            </Text>
          </View>

          {/* Memorial & Project */}
          <View className="gap-3">
            <View className="flex-row gap-4">
              <Pressable
                onPress={() => setMemorialAvailable(!memorialAvailable)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="flex-row items-center gap-2">
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: "#0a7ea4",
                      backgroundColor: memorialAvailable ? "#0a7ea4" : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {memorialAvailable && <Text style={{ color: "white", fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text className="text-sm text-foreground">Memorial Disponível</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setProjectAvailable(!projectAvailable)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="flex-row items-center gap-2">
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: "#0a7ea4",
                      backgroundColor: projectAvailable ? "#0a7ea4" : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {projectAvailable && <Text style={{ color: "white", fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text className="text-sm text-foreground">Projeto Disponível</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Sections */}
          {sections.map((section) => (
            <SectionComponent key={section.id} section={section} />
          ))}

          {/* Completion Status */}
          {allTestsFilled && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-sm font-semibold text-green-900">
                ✓ Checklist Completo! Você pode prosseguir.
              </Text>
            </View>
          )}

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <LargeButton
              title="Adicionar Novo Cômodo"
              onPress={() => {
                if (allTestsFilled) {
                  addRoom({
                    id: `room_${Date.now()}`,
                    roomName,
                    areaType,
                    sections,
                    memorialAvailable,
                    projectAvailable,
                  });
                  if (Platform.OS !== "web") {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                  router.push("../inspection/rooms-summary");
                } else {
                  if (Platform.OS !== "web") {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                  }
                }
              }}
              variant="secondary"
              disabled={!allTestsFilled}
            />
            <LargeButton
              title="Finalizar Vistoria"
              onPress={() => {
                if (allTestsFilled) {
                  addRoom({
                    id: `room_${Date.now()}`,
                    roomName,
                    areaType,
                    sections,
                    memorialAvailable,
                    projectAvailable,
                  });
                  if (Platform.OS !== "web") {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                  router.push("../inspection/rooms-summary");
                }
              }}
              variant="primary"
              disabled={!allTestsFilled}
            />
            <Pressable onPress={() => router.back()}>
              <Text className="text-center text-primary font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        visible={photoModalVisible}
        onClose={() => {
          setPhotoModalVisible(false);
          setSelectedTestForPhoto(null);
        }}
        onSave={handlePhotoSave}
        existingPhotos={selectedTestForPhoto ? sections
          .find((s) => s.id === selectedTestForPhoto.sectionId)?.tests
          .find((t) => t.id === selectedTestForPhoto.testId)?.photos || []
          : []}
      />
    </ScreenContainer>
  );
}
