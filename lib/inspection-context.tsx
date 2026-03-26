import React, { createContext, useContext, useReducer } from "react";

export type InspectionType = "technical" | "delivery";

export interface AddressData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface ClientData {
  documentType: "cpf" | "cnpj";
  document: string;
  nameType: "individual" | "company";
  fullName: string;
  address: AddressData;
  email: string;
  phone: string;
}

export interface VistoriadorData {
  documentType: "cpf" | "cnpj";
  document: string;
  nameType: "individual" | "company";
  name: string;
  address: AddressData;
  email: string;
  phone: string;
  crea?: string;
  cau?: string;
}

export interface InspectionConditions {
  date: string;
  time: string;
  weather: "sunny" | "cloudy" | "rainy" | "partly_cloudy";
  access: "total" | "partial" | "restricted";
  lighting: "adequate" | "partial" | "insufficient";
  occupancy: "empty" | "occupied" | "under_construction";
}

export interface InspectionPhoto {
  id: string;
  uri: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  itemId?: string;
  status?: "approved" | "rejected" | "na";
  description?: string;
}

export interface RoomChecklist {
  id: string;
  roomName: string;
  areaType: "internal" | "external";
  sections: ChecklistSection[];
  memorialAvailable: boolean;
  projectAvailable: boolean;
  overallStatus: "pending" | "approved" | "rejected";
  observations: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  tests: ChecklistTest[];
}

export interface ChecklistTest {
  id: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "na";
  photos: InspectionPhoto[];
}

export interface InspectionItem {
  id: string;
  name: string;
  status: "approved" | "rejected" | "na";
  photos: InspectionPhoto[];
  description: string;
}

export interface InspectionState {
  type: InspectionType | null;
  client: ClientData;
  vistoriador: VistoriadorData;
  conditions: InspectionConditions;
  items: InspectionItem[];
  rooms: RoomChecklist[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionContextType {
  state: InspectionState;
  setInspectionType: (type: InspectionType) => void;
  updateClient: (data: Partial<ClientData>) => void;
  updateVistoriador: (data: Partial<VistoriadorData>) => void;
  updateConditions: (data: Partial<InspectionConditions>) => void;
  addPhoto: (photo: InspectionPhoto) => void;
  updateItem: (itemId: string, data: Partial<InspectionItem>) => void;
  addRoom: (room: RoomChecklist) => void;
  updateRoom: (roomId: string, data: Partial<RoomChecklist>) => void;
  removeRoom: (roomId: string) => void;
  reset: () => void;
}

const defaultAddress: AddressData = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  cep: "",
};

const defaultState: InspectionState = {
  type: null,
  client: {
    documentType: "cpf",
    document: "",
    nameType: "individual",
    fullName: "",
    address: { ...defaultAddress },
    email: "",
    phone: "",
  },
  vistoriador: {
    documentType: "cpf",
    document: "",
    nameType: "individual",
    name: "",
    address: { ...defaultAddress },
    email: "",
    phone: "",
    crea: "",
    cau: "",
  },
  conditions: {
    date: "",
    time: "",
    weather: "sunny",
    access: "total",
    lighting: "adequate",
    occupancy: "empty",
  },
  items: [],
  rooms: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

type Action =
  | { type: "SET_INSPECTION_TYPE"; payload: InspectionType }
  | { type: "UPDATE_CLIENT"; payload: Partial<ClientData> }
  | { type: "UPDATE_VISTORIADOR"; payload: Partial<VistoriadorData> }
  | { type: "UPDATE_CONDITIONS"; payload: Partial<InspectionConditions> }
  | { type: "ADD_PHOTO"; payload: InspectionPhoto }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; data: Partial<InspectionItem> } }
  | { type: "ADD_ROOM"; payload: RoomChecklist }
  | { type: "UPDATE_ROOM"; payload: { roomId: string; data: Partial<RoomChecklist> } }
  | { type: "REMOVE_ROOM"; payload: string }
  | { type: "RESET" };

function inspectionReducer(state: InspectionState, action: Action): InspectionState {
  switch (action.type) {
    case "SET_INSPECTION_TYPE":
      return { ...state, type: action.payload, updatedAt: new Date().toISOString() };
    case "UPDATE_CLIENT":
      return {
        ...state,
        client: { ...state.client, ...action.payload },
        updatedAt: new Date().toISOString(),
      };
    case "UPDATE_VISTORIADOR":
      return {
        ...state,
        vistoriador: { ...state.vistoriador, ...action.payload },
        updatedAt: new Date().toISOString(),
      };
    case "UPDATE_CONDITIONS":
      return {
        ...state,
        conditions: { ...state.conditions, ...action.payload },
        updatedAt: new Date().toISOString(),
      };
    case "ADD_PHOTO":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, photos: [...item.photos, action.payload] }
            : item
        ),
        updatedAt: new Date().toISOString(),
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, ...action.payload.data }
            : item
        ),
        updatedAt: new Date().toISOString(),
      };
    case "ADD_ROOM":
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
        updatedAt: new Date().toISOString(),
      };
    case "UPDATE_ROOM":
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.payload.roomId
            ? { ...room, ...action.payload.data }
            : room
        ),
        updatedAt: new Date().toISOString(),
      };
    case "REMOVE_ROOM":
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.id !== action.payload),
        updatedAt: new Date().toISOString(),
      };
    case "RESET":
      return { ...defaultState, createdAt: new Date().toISOString() };
    default:
      return state;
  }
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inspectionReducer, defaultState);

  const value: InspectionContextType = {
    state,
    setInspectionType: (type) => dispatch({ type: "SET_INSPECTION_TYPE", payload: type }),
    updateClient: (data) => dispatch({ type: "UPDATE_CLIENT", payload: data }),
    updateVistoriador: (data) => dispatch({ type: "UPDATE_VISTORIADOR", payload: data }),
    updateConditions: (data) => dispatch({ type: "UPDATE_CONDITIONS", payload: data }),
    addPhoto: (photo) => dispatch({ type: "ADD_PHOTO", payload: photo }),
    updateItem: (itemId, data) => dispatch({ type: "UPDATE_ITEM", payload: { itemId, data } }),
    addRoom: (room) => dispatch({ type: "ADD_ROOM", payload: room }),
    updateRoom: (roomId, data) => dispatch({ type: "UPDATE_ROOM", payload: { roomId, data } }),
    removeRoom: (roomId) => dispatch({ type: "REMOVE_ROOM", payload: roomId }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return (
    <InspectionContext.Provider value={value}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error("useInspection must be used within InspectionProvider");
  }
  return context;
}
