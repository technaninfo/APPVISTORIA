import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInspection, type Section, type Test } from "@/lib/inspection-context";
import { useState, useMemo } from "react";

// Default sections and tests for all inspection types
const DEFAULT_SECTIONS = [
  {
    name: "Estrutura",
    tests: [
      "Fundação",
      "Paredes",
      "Teto",
      "Piso",
      "Cobertura",
    ],
  },
  {
    name: "Hidráulica",
    tests: [
      "Tubulações",
      "Vazamentos",
      "Torneiras",
      "Chuveiro",
      "Vaso sanitário",
    ],
  },
  {
    name: "Elétrica",
    tests: [
      "Fiação",
      "Disjuntores",
      "Tomadas",
      "Interruptores",
      "Iluminação",
    ],
  },
  {
    name: "Acabamento",
    tests: [
      "Pintura",
      "Azulejos",
      "Portas",
      "Janelas",
      "Rodapé",
    ],
  },
];

export default function ChecklistScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { inspection, addSection, updateTest, addTest } = useInspection();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentRoom = useMemo(() => {
    return inspection?.rooms.find((r) => r.id === roomId);
  }, [inspection, roomId]);

  const handleAddSection = (sectionName: string, testNames: string[]) => {
    if (!currentRoom) return;

    const newSection: Section = {
      id: Date.now().toString(),
      name: sectionName,
      tests: testNames.map((testName, idx) => ({
        id: `${Date.now()}-${idx}`,
        name: testName,
        status: "pass" as const,
        photos: [],
      })),
      isNA: false,
    };

    addSection(roomId!, newSection);
  };

  const handleTestStatusChange = (
    sectionId: string,
    testId: string,
    status: "pass" | "fail" | "na"
  ) => {
    if (!currentRoom) return;

    const section = currentRoom.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const test = section.tests.find((t) => t.id === testId);
    if (!test) return;

    updateTest(roomId!, sectionId, testId, {
      ...test,
      status,
    });
  };

  const handleSectionNA = (sectionId: string, isNA: boolean) => {
    if (!currentRoom) return;

    const section = currentRoom.sections.find((s) => s.id === sectionId);
    if (!section) return;

    // Mark all tests in section as NA
    section.tests.forEach((test) => {
      updateTest(roomId!, sectionId, test.id, {
        ...test,
        status: isNA ? ("na" as const) : ("pass" as const),
      });
    });
  };

  const handleContinue = () => {
    router.push({
      pathname: "/inspection/summary",
      params: { roomId },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Checklist</Text>
            <Text className="text-sm text-muted text-center">
              Cômodo: {currentRoom?.name}
            </Text>
          </View>

          {/* Existing Sections */}
          {currentRoom?.sections && currentRoom.sections.length > 0 ? (
            currentRoom.sections.map((section) => (
              <View key={section.id} className="gap-2">
                {/* Section Header */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )
                  }
                  className="bg-primary rounded-lg p-4 flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-white">
                      {section.name}
                    </Text>
                    <Text className="text-xs text-white/80">
                      {section.tests.length} testes
                    </Text>
                  </View>
                  <Text className="text-white text-xl">
                    {expandedSection === section.id ? "▼" : "▶"}
                  </Text>
                </TouchableOpacity>

                {/* Tests */}
                {expandedSection === section.id && (
                  <View className="gap-2 ml-2">
                    {section.tests.map((test) => (
                      <View
                        key={test.id}
                        className="bg-surface rounded-lg p-3 border border-border"
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-sm font-semibold text-foreground flex-1">
                            {test.name}
                          </Text>
                        </View>

                        {/* Status Buttons */}
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() =>
                              handleTestStatusChange(section.id, test.id, "pass")
                            }
                            className={`flex-1 px-3 py-2 rounded-lg ${
                              test.status === "pass"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <Text
                              className={`text-center text-xs font-semibold ${
                                test.status === "pass"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            >
                              ✓ OK
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              handleTestStatusChange(section.id, test.id, "fail")
                            }
                            className={`flex-1 px-3 py-2 rounded-lg ${
                              test.status === "fail"
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <Text
                              className={`text-center text-xs font-semibold ${
                                test.status === "fail"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            >
                              ✗ Falha
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              handleTestStatusChange(section.id, test.id, "na")
                            }
                            className={`flex-1 px-3 py-2 rounded-lg ${
                              test.status === "na"
                                ? "bg-gray-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <Text
                              className={`text-center text-xs font-semibold ${
                                test.status === "na"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            >
                              N/A
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Text className="text-sm text-blue-900">
                💡 Nenhuma seção adicionada. Selecione as seções abaixo para começar.
              </Text>
            </View>
          )}

          {/* Add Sections */}
          <View className="gap-2 mt-4">
            <Text className="text-sm font-semibold text-foreground">
              Adicionar Seções:
            </Text>
            {DEFAULT_SECTIONS.map((section) => (
              <TouchableOpacity
                key={section.name}
                onPress={() =>
                  handleAddSection(section.name, section.tests)
                }
                className="bg-surface rounded-lg p-3 border border-dashed border-primary active:opacity-80"
              >
                <Text className="text-sm font-semibold text-primary">
                  + {section.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleContinue}
              className="w-full bg-primary px-6 py-4 rounded-lg active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">
                Próximo Cômodo / Resumo
              </Text>
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
