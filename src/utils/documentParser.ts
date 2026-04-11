import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedItem {
  section: string;
  description: string;
  legislation?: string;
}

export class DocumentParser {
  /**
   * Extrai texto de um arquivo PDF
   */
  static async parsePDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
       const page = await pdf.getPage(i);
       const content = await page.getTextContent();
       const strings = content.items.map((item: any) => item.str);
       fullText += strings.join(' ') + '\n';
    }

    return fullText;
  }

  /**
   * Extrai texto de um arquivo Word (.docx)
   */
  static async parseWord(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  /**
   * Tenta estruturar o texto bruto em itens de inspeção
   * Baseia-se em quebras de linha e padrões comuns (ex: numeração)
   */
  static heuristicParse(text: string): ParsedItem[] {
    const lines = text.split('\n').filter(l => l.trim().length > 5);
    const items: ParsedItem[] = [];
    let currentSection = 'Geral';

    lines.forEach(line => {
      // Tenta identificar se a linha é um título de seção (curta e em caps ou negrito-ish)
      if (line.length < 50 && (line === line.toUpperCase() || /^[0-9]\./.test(line))) {
        currentSection = line.trim();
        return;
      }

      // Procura possíveis referências legislativas no meio do texto
      const legMatch = line.match(/(RDC|LEI|PORTARIA|DECRETO)\s\d+[\/\d]*/i);
      
      items.push({
        section: currentSection,
        description: line.trim(),
        legislation: legMatch ? legMatch[0] : undefined
      });
    });

    return items;
  }
}
