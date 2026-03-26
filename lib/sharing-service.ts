import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { File, Directory } from "expo-file-system";
import { Platform } from "react-native";

/**
 * Compartilha um arquivo usando o sistema nativo
 */
export async function shareFile(fileUri: string, fileName: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.warn("Compartilhamento não disponível nesta plataforma");
      return;
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: getMimeType(fileName),
      dialogTitle: "Compartilhar Arquivo",
      UTI: getUTI(fileName),
    });
  } catch (error) {
    console.error("Erro ao compartilhar arquivo:", error);
    throw error;
  }
}

/**
 * Compartilha múltiplos arquivos (pasta)
 */
export async function shareFolder(folderPath: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.warn("Compartilhamento não disponível nesta plataforma");
      return;
    }

    // No Android/iOS, compartilhamos o arquivo de metadados como representante
    const metadataFile = new File(folderPath, "metadata.json");
    try {
      await Sharing.shareAsync(metadataFile.uri, {
        mimeType: "application/json",
        dialogTitle: "Compartilhar Vistoria",
      });
    } catch (e) {
      console.warn("Arquivo de metadados não encontrado");
    }
  } catch (error) {
    console.error("Erro ao compartilhar pasta:", error);
    throw error;
  }
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
  const available = await Sharing.isAvailableAsync();
  return available === true;
}
