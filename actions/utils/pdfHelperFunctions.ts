import PDFParser from 'pdf2json';

type PDFTextItem = {
    R: {
        T: string;
    }[];
};

type PDFPage = {
    Texts: PDFTextItem[];
};

type ParsedPDFData = {
    Pages: PDFPage[];
};

export function extractTextFromPDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (err) => {
            console.error('[PDF Parser] Error:', err.parserError);
            reject(err.parserError);
        });

        pdfParser.on('pdfParser_dataReady', (pdfData: ParsedPDFData) => {
            let extractedText = '';

            const pages = pdfData?.Pages;

            if (!Array.isArray(pages)) {
                return reject('No pages found in PDF');
            }

            for (const page of pages) {
                for (const textItem of page.Texts) {
                    for (const subItem of textItem.R) {
                        extractedText += decodeURIComponent(subItem.T) + ' ';
                    }
                    extractedText += '\n';
                }
            }

            resolve(extractedText.trim());
        });

        pdfParser.parseBuffer(buffer);
    });
}
