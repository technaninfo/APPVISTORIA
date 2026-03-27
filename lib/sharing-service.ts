import { Platform } from "react-native";

/**
 * Compartilha um arquivo usando o sistema nativo (não implementado)
 */
export async function shareFile(fileUri: string, fileName: string): Promise<void> {
  console.warn("Compartilhamento de arquivo não disponível");
  // Funcionalidade desabilitada
}

/**
 * Compartilha múltiplos arquivos (pasta) (não implementado)
 */
export async function shareFolder(folderPath: string): Promise<void> {
  console.warn("Compartilhamento de pasta não disponível");
  // Funcionalidade desabilitada
}

/**
 * Obtém o tipo MIME baseado na extensão do arquivo
 */
function getMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    json: "application/json",
    txt: "text/plain",
    zip: "application/zip",
    html: "text/html",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Obtém o UTI (Uniform Type Identifier) para iOS
 */
function getUTI(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const utis: Record<string, string> = {
    pdf: "com.adobe.pdf",
    jpg: "public.jpeg",
    jpeg: "public.jpeg",
    png: "public.png",
    json: "public.json",
    txt: "public.plain-text",
    zip: "public.zip-archive",
    html: "public.html",
  };
  return utis[ext] || "public.item";
}

/**
 * Cria um arquivo ZIP com todos os dados da vistoria
 */
export async function createInspectionZip(folderPath: string): Promise<string> {
  try {
    // Para esta versão, retornamos o caminho da pasta
    // Em produção, seria necessário usar uma biblioteca de ZIP
    return folderPath;
  } catch (error) {
    console.error("Erro ao criar ZIP:", error);
    throw error;
  }
}

/**
 * Verifica se o compartilhamento está disponível
 */
export async function isSharingAvailable(): Promise<boolean> {
  return false; // Desabilitado
}
