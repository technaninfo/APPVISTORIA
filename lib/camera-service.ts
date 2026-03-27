export interface PhotoMetadata {
  timestamp: string;
  latitude?: number;
  longitude?: number;
  locationAvailable: boolean;
}

/**
 * Obtém a localização atual do dispositivo (offline)
 */
export async function getCurrentLocation(): Promise<{
  latitude?: number;
  longitude?: number;
  available: boolean;
}> {
  // Localização desabilitada - funcionalidade offline
  return { available: false };
}

/**
 * Gera metadados de foto com timestamp
 */
export async function generatePhotoMetadata(): Promise<PhotoMetadata> {
  const now = new Date();
  const timestamp = now.toISOString();

  const location = await getCurrentLocation();

  return {
    timestamp,
    latitude: location.latitude,
    longitude: location.longitude,
    locationAvailable: location.available,
  };
}

/**
 * Formata timestamp para nome de arquivo
 */
export function formatTimestampForFilename(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toISOString().replace(/[:.]/g, "-").slice(0, -5);
}

/**
 * Redimensiona imagem para economizar espaço (não implementado)
 */
export async function compressImage(
  imageUri: string,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<string> {
  // Compressão desabilitada - retorna URI original
  return imageUri;
}

/**
 * Formata coordenadas GPS para exibição
 */
export function formatCoordinates(latitude?: number, longitude?: number): string {
  if (!latitude || !longitude) {
    return "Localização não disponível";
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

/**
 * Formata timestamp para exibição
 */
export function formatTimestampForDisplay(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleString("pt-BR");
}
