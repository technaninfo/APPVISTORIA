/**
 * Tipos para o formulário dinâmico inteligente de vistoria
 */

export interface FormTest {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected" | "na";
  photos: Array<{
    id: string;
    uri: string;
    caption: string;
  }>;
}

export interface FormItem {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected" | "na";
  isExpanded: boolean;
  tests: FormTest[];
}

export interface FormRoom {
  id: string;
  name: string;
  areaType: "internal" | "external";
  items: FormItem[];
  observations: string;
}

export interface InspectionForm {
  rooms: FormRoom[];
  currentRoomIndex: number;
}

// Cômodos predefinidos
export const PREDEFINED_ROOMS = [
  "Sala de Estar",
  "Sala de Jantar",
  "Cozinha",
  "Quarto 1",
  "Quarto 2",
  "Quarto 3",
  "Banheiro",
  "Lavanderia",
  "Garagem",
  "Varanda",
  "Corredor",
  "Escada",
];

// Itens padrão por tipo de área
export const STANDARD_ITEMS = {
  internal: [
    {
      name: "Paredes",
      tests: [
        "Integridade estrutural",
        "Umidade",
        "Rachaduras",
        "Pintura",
      ],
    },
    {
      name: "Piso",
      tests: [
        "Integridade",
        "Nivelamento",
        "Danos",
        "Limpeza",
      ],
    },
    {
      name: "Teto",
      tests: [
        "Integridade",
        "Manchas de umidade",
        "Pintura",
        "Estrutura",
      ],
    },
    {
      name: "Portas e Janelas",
      tests: [
        "Funcionamento",
        "Vedação",
        "Vidros",
        "Fechaduras",
      ],
    },
    {
      name: "Iluminação",
      tests: [
        "Funcionamento",
        "Quantidade de pontos",
        "Interruptores",
      ],
    },
    {
      name: "Tomadas",
      tests: [
        "Funcionamento",
        "Quantidade",
        "Segurança",
      ],
    },
    {
      name: "Ar Condicionado",
      tests: [
        "Presença",
        "Funcionamento",
        "Limpeza",
      ],
    },
    {
      name: "Aquecedor",
      tests: [
        "Presença",
        "Funcionamento",
        "Segurança",
      ],
    },
  ],
  external: [
    {
      name: "Estrutura",
      tests: [
        "Integridade",
        "Rachaduras",
        "Umidade",
        "Pintura",
      ],
    },
    {
      name: "Cobertura",
      tests: [
        "Integridade",
        "Vazamentos",
        "Telhas/Placas",
      ],
    },
    {
      name: "Piso/Calçada",
      tests: [
        "Integridade",
        "Danos",
        "Nivelamento",
      ],
    },
    {
      name: "Drenagem",
      tests: [
        "Funcionamento",
        "Limpeza",
        "Entupimentos",
      ],
    },
    {
      name: "Iluminação Externa",
      tests: [
        "Funcionamento",
        "Quantidade",
        "Segurança",
      ],
    },
    {
      name: "Portão/Cerca",
      tests: [
        "Integridade",
        "Funcionamento",
        "Segurança",
      ],
    },
  ],
};
