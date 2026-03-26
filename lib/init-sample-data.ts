import AsyncStorage from "@react-native-async-storage/async-storage";

const INSPECTIONS_KEY = "inspections";
const SAMPLE_INITIALIZED = "sample_initialized";

export async function initializeSampleData() {
  try {
    // Verificar se já foi inicializado
    const isInitialized = await AsyncStorage.getItem(SAMPLE_INITIALIZED);
    if (isInitialized) {
      return;
    }

    // Dados fictícios da vistoria
    const sampleInspection = {
      id: "sample_001",
      type: "delivery",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      clientName: "Silva Imóveis LTDA",
      clientType: "pj",
      client: {
        fullName: "",
        razaoSocial: "Silva Imóveis LTDA",
        cnpj: "12.345.678/0001-90",
        email: "contato@silvaimoveis.com.br",
        phone: "(11) 3456-7890",
        address: {
          street: "Avenida Paulista",
          number: "1000",
          complement: "Sala 1500",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          cep: "01311-100",
        },
      },
      vistoriador: {
        name: "Carlos Roberto Vistoriador",
        documentType: "cpf",
        document: "123.456.789-00",
        email: "carlos@vistoriador.com.br",
        phone: "(11) 98765-4321",
        address: {
          street: "Rua das Acácias",
          number: "250",
          complement: "Apto 305",
          neighborhood: "Vila Mariana",
          city: "São Paulo",
          state: "SP",
          cep: "04012-130",
        },
        crea: "",
        cau: "",
      },
      conditions: {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "14:30",
        weather: "Ensolarado",
        access: "Fácil",
        lighting: "Boa",
        occupancy: "Vazio",
      },
      rooms: [
        {
          id: "room_001",
          name: "Sala de Estar",
          areaType: "internal",
          observations: "Ambiente bem iluminado, sem danos aparentes",
          items: [
            { id: "item_001", name: "Piso", status: "approved", photos: [] },
            { id: "item_002", name: "Paredes", status: "approved", photos: [] },
            { id: "item_003", name: "Teto", status: "approved", photos: [] },
            {
              id: "item_004",
              name: "Janelas",
              status: "rejected",
              photos: [
                {
                  id: "photo_001",
                  caption: "Vidro trincado no canto superior direito",
                  uri: "file:///sample/photo_001.jpg",
                },
              ],
            },
          ],
        },
        {
          id: "room_002",
          name: "Cozinha",
          areaType: "internal",
          observations: "Cozinha funcional, alguns detalhes de manutenção necessários",
          items: [
            { id: "item_005", name: "Piso", status: "approved", photos: [] },
            { id: "item_006", name: "Armários", status: "approved", photos: [] },
            {
              id: "item_007",
              name: "Pia",
              status: "rejected",
              photos: [
                {
                  id: "photo_002",
                  caption: "Vazamento na tubulação",
                  uri: "file:///sample/photo_002.jpg",
                },
              ],
            },
            { id: "item_008", name: "Fogão", status: "na", photos: [] },
          ],
        },
      ],
      status: "completed",
    };

    // Salvar no AsyncStorage
    const existingInspections = await AsyncStorage.getItem(INSPECTIONS_KEY);
    const inspections = existingInspections ? JSON.parse(existingInspections) : [];

    // Adicionar vistoria fictícia
    inspections.unshift(sampleInspection);
    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(inspections));

    // Marcar como inicializado
    await AsyncStorage.setItem(SAMPLE_INITIALIZED, "true");

    console.log("✅ Dados de exemplo carregados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar dados de exemplo:", error);
  }
}
