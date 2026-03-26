import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type InspectionType = "technical" | "delivery";

export interface ClientData {
  fullName: string;
  address: string;
  cep: string;
  email: string;
  phone: string;
}

export interface InspectorData {
  name: string;
  cpfCnpj: string;
  address: string;
  cep: string;
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
  inspector: InspectorData;
  conditions: InspectionConditions;
  items: InspectionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionContextType {
  state: InspectionState;
  setInspectionType: (type: InspectionType) => void;
  updateClient: (data: Partial<ClientData>) => void;
  updateInspector: (data: Partial<InspectorData>) => void;
  updateConditions: (data: Partial<InspectionConditions>) => void;
  addPhoto: (photo: InspectionPhoto) => void;
  updateItem: (itemId: string, data: Partial<InspectionItem>) => void;
  reset: () => void;
}

const defaultState: InspectionState = {
  type: null,
  client: {
    fullName: "",
    address: "",
    cep: "",
    email: "",
    phone: "",
  },
  inspector: {
    name: "",
    cpfCnpj: "",
    address: "",
    cep: "",
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

type Action =
  | { type: "SET_INSPECTION_TYPE"; payload: InspectionType }
  | { type: "UPDATE_CLIENT"; payload: Partial<ClientData> }
  | { type: "UPDATE_INSPECTOR"; payload: Partial<InspectorData> }
  | { type: "UPDATE_CONDITIONS"; payload: Partial<InspectionConditions> }
  | { type: "ADD_PHOTO"; payload: InspectionPhoto }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; data: Partial<InspectionItem> } }
  | { type: "RESET" };

function inspectionReducer(state: InspectionState, action: Action): InspectionState {
  switch (action.type) {
    case "SET_INSPECTION_TYPE":
      return { ...state, type: action.payload };
    case "UPDATE_CLIENT":
      return { ...state, client: { ...state.client, ...action.payload } };
    case "UPDATE_INSPECTOR":
      return { ...state, inspector: { ...state.inspector, ...action.payload } };
    case "UPDATE_CONDITIONS":
      return { ...state, conditions: { ...state.conditions, ...action.payload } };
    case "ADD_PHOTO":
      return { ...state, items: [...state.items, { id: action.payload.id, name: "", status: "na", photos: [action.payload], description: "" }] };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, ...action.payload.data } : item
        ),
      };
    case "RESET":
      return defaultState;
    default:
      return state;
  }
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inspectionReducer, defaultState);

  const value: InspectionContextType = {
    state,
    setInspectionType: (type) => dispatch({ type: "SET_INSPECTION_TYPE", payload: type }),
    updateClient: (data) => dispatch({ type: "UPDATE_CLIENT", payload: data }),
    updateInspector: (data) => dispatch({ type: "UPDATE_INSPECTOR", payload: data }),
    updateConditions: (data) => dispatch({ type: "UPDATE_CONDITIONS", payload: data }),
    addPhoto: (photo) => dispatch({ type: "ADD_PHOTO", payload: photo }),
    updateItem: (itemId, data) => dispatch({ type: "UPDATE_ITEM", payload: { itemId, data } }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return <InspectionContext.Provider value={value}>{children}</InspectionContext.Provider>;
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error("useInspection must be used within InspectionProvider");
  }
  return context;
}
