import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system";
import { InspectionState } from "./inspection-context";

/**
 * Gera um relatório em PDF para a vistoria
 */
export async function generateInspectionPDF(
  inspection: InspectionState,
  folderPath: string
): Promise<string> {
  try {
    // Criar conteúdo HTML do PDF
    const htmlContent = generateHTMLReport(inspection);

    // Salvar como arquivo PDF (com nome correto)
    const pdfPath = `${folderPath}/relatorio_vistoria.pdf`;
    const pdfFile = new File(folderPath, "relatorio_vistoria.pdf");
    await pdfFile.write(htmlContent);

    return pdfFile.uri;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

/**
 * Gera o conteúdo HTML do relatório (será convertido para PDF)
 */
function generateHTMLReport(inspection: InspectionState): string {
  const typeLabel = inspection.type === "technical" ? "Técnica" : "Entrega de Chaves";
  const weatherLabel = {
    sunny: "Ensolarado",
    cloudy: "Nublado",
    rainy: "Chuvoso",
    partly_cloudy: "Parcialmente nublado",
  }[inspection.conditions.weather] || "N/A";

  const accessLabel = {
    total: "Total",
    partial: "Parcial",
    restricted: "Restrito",
  }[inspection.conditions.access] || "N/A";

  const lightingLabel = {
    adequate: "Adequada",
    partial: "Parcial",
    insufficient: "Insuficiente",
  }[inspection.conditions.lighting] || "N/A";

  const occupancyLabel = {
    empty: "Desocupado",
    occupied: "Ocupado",
    under_construction: "Em obra",
  }[inspection.conditions.occupancy] || "N/A";

  // Gerar resumo de cômodos
  const roomsHTML = inspection.rooms.map((room, index) => {
    const totalTests = room.sections.reduce((sum, section) => sum + section.tests.length, 0);
    const approvedTests = room.sections.reduce(
      (sum, section) => sum + section.tests.filter(t => t.status === "approved").length,
      0
    );
    const rejectedTests = room.sections.reduce(
      (sum, section) => sum + section.tests.filter(t => t.status === "rejected").length,
      0
    );
    const naTests = room.sections.reduce(
      (sum, section) => sum + section.tests.filter(t => t.status === "na").length,
      0
    );

    const roomStatus = rejectedTests > 0 ? "REPROVADO" : "APROVADO";
    const statusColor = rejectedTests > 0 ? "#EF4444" : "#10B981";

    return `
      <div style="page-break-inside: avoid; margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
        <h3 style="color: #0a7ea4; margin-bottom: 10px;">Cômodo ${index + 1}: ${room.roomName}</h3>
        <p style="margin: 5px 0; color: #666;"><strong>Tipo de Área:</strong> ${room.areaType === "internal" ? "Interna" : "Externa"}</p>
        <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${roomStatus}</span></p>
        
        <div style="margin-top: 10px; padding: 10px; background-color: #f9fafb; border-radius: 4px;">
          <p style="margin: 3px 0; font-size: 13px;"><strong>Resumo de Testes:</strong></p>
          <p style="margin: 3px 0; font-size: 13px;">• Total: ${totalTests} testes</p>
          <p style="margin: 3px 0; font-size: 13px; color: #10B981;">• Aprovados: ${approvedTests}</p>
          <p style="margin: 3px 0; font-size: 13px; color: #EF4444;">• Reprovados: ${rejectedTests}</p>
          <p style="margin: 3px 0; font-size: 13px; color: #9CA3AF;">• Não Aplicável: ${naTests}</p>
        </div>

        <div style="margin-top: 10px;">
          <p style="margin: 5px 0; font-size: 13px;"><strong>Seções Inspecionadas:</strong></p>
          ${room.sections.map(section => {
            const sectionApproved = section.tests.filter(t => t.status === "approved").length;
            const sectionTotal = section.tests.length;
            return `
              <p style="margin: 3px 0; font-size: 12px; color: #666;">
                • ${section.title}: ${sectionApproved}/${sectionTotal} testes
              </p>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Vistoria - Check+ Vistorias</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0a7ea4;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0a7ea4;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #0a7ea4;
      font-size: 18px;
      border-left: 4px solid #0a7ea4;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-item {
      padding: 10px;
      background-color: #f9fafb;
      border-radius: 4px;
      border-left: 3px solid #0a7ea4;
    }
    .info-item strong {
      color: #0a7ea4;
      display: block;
      margin-bottom: 3px;
      font-size: 12px;
    }
    .info-item p {
      color: #333;
      font-size: 14px;
    }
    .status-approved {
      color: #10B981;
      font-weight: bold;
    }
    .status-rejected {
      color: #EF4444;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background-color: #0a7ea4;
      color: white;
      padding: 10px;
      text-align: left;
      font-size: 13px;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .room-card {
      page-break-inside: avoid;
      margin-bottom: 20px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      background-color: #fafafa;
    }
    .room-card h3 {
      color: #0a7ea4;
      margin-bottom: 10px;
      font-size: 16px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Check+ Vistorias</h1>
      <p>Relatório de Vistoria - ${typeLabel}</p>
      <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
    </div>

    <!-- Dados do Cliente -->
    <div class="section">
      <h2>Dados do Cliente</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Nome</strong>
          <p>${inspection.client.fullName || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Email</strong>
          <p>${inspection.client.email || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Telefone</strong>
          <p>${inspection.client.phone || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Endereço</strong>
          <p>${inspection.client.address || "N/A"}</p>
        </div>
      </div>
    </div>

    <!-- Dados do Vistoriador -->
    <div class="section">
      <h2>Dados do Vistoriador</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Nome</strong>
          <p>${inspection.vistoriador.name || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>CPF/CNPJ</strong>
          <p>${inspection.vistoriador.document || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Email</strong>
          <p>${inspection.vistoriador.email || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Telefone</strong>
          <p>${inspection.vistoriador.phone || "N/A"}</p>
        </div>
      </div>
    </div>

    <!-- Condições da Vistoria -->
    <div class="section">
      <h2>Condições da Vistoria</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Data</strong>
          <p>${new Date(inspection.conditions.date).toLocaleDateString("pt-BR")}</p>
        </div>
        <div class="info-item">
          <strong>Hora</strong>
          <p>${inspection.conditions.time || "N/A"}</p>
        </div>
        <div class="info-item">
          <strong>Clima</strong>
          <p>${weatherLabel}</p>
        </div>
        <div class="info-item">
          <strong>Acesso</strong>
          <p>${accessLabel}</p>
        </div>
        <div class="info-item">
          <strong>Iluminação</strong>
          <p>${lightingLabel}</p>
        </div>
        <div class="info-item">
          <strong>Ocupação</strong>
          <p>${occupancyLabel}</p>
        </div>
      </div>
    </div>

    <!-- Cômodos Inspecionados -->
    <div class="section">
      <h2>Cômodos Inspecionados</h2>
      ${roomsHTML || '<p style="color: #999;">Nenhum cômodo inspecionado ainda.</p>'}
    </div>

    <!-- Resumo Geral -->
    <div class="section">
      <h2>Resumo Geral</h2>
      <table>
        <tr>
          <th>Métrica</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>Total de Cômodos</td>
          <td>${inspection.rooms.length}</td>
        </tr>
        <tr>
          <td>Total de Testes</td>
          <td>${inspection.rooms.reduce((sum, room) => sum + room.sections.reduce((s, section) => s + section.tests.length, 0), 0)}</td>
        </tr>
        <tr>
          <td>Testes Aprovados</td>
          <td class="status-approved">${inspection.rooms.reduce((sum, room) => sum + room.sections.reduce((s, section) => s + section.tests.filter(t => t.status === "approved").length, 0), 0)}</td>
        </tr>
        <tr>
          <td>Testes Reprovados</td>
          <td class="status-rejected">${inspection.rooms.reduce((sum, room) => sum + room.sections.reduce((s, section) => s + section.tests.filter(t => t.status === "rejected").length, 0), 0)}</td>
        </tr>
        <tr>
          <td>Testes Não Aplicável</td>
          <td>${inspection.rooms.reduce((sum, room) => sum + room.sections.reduce((s, section) => s + section.tests.filter(t => t.status === "na").length, 0), 0)}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Este relatório foi gerado automaticamente pelo sistema Check+ Vistorias</p>
      <p>Data de Geração: ${new Date().toLocaleString("pt-BR")}</p>
    </div>
  </div>
</body>
</html>
  `;
}
