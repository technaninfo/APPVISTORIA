import React, { createContext, useContext, useState } from "react";

export type InspectionType = "simple" | "technical" | "rental";

export interface ClientData {
  name: string;
  phone: string;
  email: string;
  cpf?: string;
  cnpj?: string;
}

export interface TechnicalData {
  crea: string;
  uf: string;
  art: string;
  technicalOpinion: string;
}

export interface RentalData {
  address: string;
  entryType: "entry" | "exit";
  landlordName: string;
  landlordPhone: string;
  tenantName: string;
  tenantPhone: string;
  realEstateAgency?: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  area?: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  tests: Test[];
  isNA: boolean;
}

export interface Test {
  id: string;
  name: string;
  status: "pass" | "fail" | "na";
  photos: string[];
  notes?: string;
}

export interface InspectionData {
  type: InspectionType;
  clientData: ClientData;
  technicalData?: TechnicalData;
  rentalData?: RentalData;
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
}

interface InspectionContextType {
  inspection: InspectionData | null;
  setInspection: (inspection: InspectionData | null) => void;
  updateClientData: (data: ClientData) => void;
  updateTechnicalData: (data: TechnicalData) => void;
  updateRentalData: (data: RentalData) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, room: Room) => void;
  removeRoom: (roomId: string) => void;
  addSection: (roomId: string, section: Section) => void;
  updateSection: (roomId: string, sectionId: string, section: Section) => void;
  removeSection: (roomId: string, sectionId: string) => void;
  addTest: (roomId: string, sectionId: string, test: Test) => void;
  updateTest: (roomId: string, sectionId: string, testId: string, test: Test) => void;
  removeTest: (roomId: string, sectionId: string, testId: string) => void;
  addPhotoToTest: (roomId: string, sectionId: string, testId: string, photoUri: string) => void;
  removePhotoFromTest: (roomId: string, sectionId: string, testId: string, photoIndex: number) => void;
  markSectionAsNA: (roomId: string, sectionId: string, isNA: boolean) => void;
  resetInspection: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [inspection, setInspection] = useState<InspectionData | null>(null);

  const updateClientData = (data: ClientData) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      clientData: data,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTechnicalData = (data: TechnicalData) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      technicalData: data,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRentalData = (data: RentalData) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rentalData: data,
      updatedAt: new Date().toISOString(),
    });
  };

  const addRoom = (room: Room) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: [...inspection.rooms, room],
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRoom = (roomId: string, room: Room) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) => (r.id === roomId ? room : r)),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeRoom = (roomId: string) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.filter((r) => r.id !== roomId),
      updatedAt: new Date().toISOString(),
    });
  };

  const addSection = (roomId: string, section: Section) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId ? { ...r, sections: [...r.sections, section] } : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateSection = (roomId: string, sectionId: string, section: Section) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) => (s.id === sectionId ? section : s)),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeSection = (roomId: string, sectionId: string) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.filter((s) => s.id !== sectionId),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const addTest = (roomId: string, sectionId: string, test: Test) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId ? { ...s, tests: [...s.tests, test] } : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTest = (roomId: string, sectionId: string, testId: string, test: Test) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      tests: s.tests.map((t) => (t.id === testId ? test : t)),
                    }
                  : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeTest = (roomId: string, sectionId: string, testId: string) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      tests: s.tests.filter((t) => t.id !== testId),
                    }
                  : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const addPhotoToTest = (roomId: string, sectionId: string, testId: string, photoUri: string) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      tests: s.tests.map((t) =>
                        t.id === testId ? { ...t, photos: [...t.photos, photoUri] } : t
                      ),
                    }
                  : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removePhotoFromTest = (
    roomId: string,
    sectionId: string,
    testId: string,
    photoIndex: number
  ) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      tests: s.tests.map((t) =>
                        t.id === testId
                          ? {
                              ...t,
                              photos: t.photos.filter((_, i) => i !== photoIndex),
                            }
                          : t
                      ),
                    }
                  : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const markSectionAsNA = (roomId: string, sectionId: string, isNA: boolean) => {
    if (!inspection) return;
    setInspection({
      ...inspection,
      rooms: inspection.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId
                  ? {
                      ...s,
                      isNA,
                      tests: isNA
                        ? s.tests.map((t) => ({ ...t, status: "na" as const }))
                        : s.tests,
                    }
                  : s
              ),
            }
          : r
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const resetInspection = () => {
    setInspection(null);
  };

  return (
    <InspectionContext.Provider
      value={{
        inspection,
        setInspection,
        updateClientData,
        updateTechnicalData,
        updateRentalData,
        addRoom,
        updateRoom,
        removeRoom,
        addSection,
        updateSection,
        removeSection,
        addTest,
        updateTest,
        removeTest,
        addPhotoToTest,
        removePhotoFromTest,
        markSectionAsNA,
        resetInspection,
      }}
    >
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
