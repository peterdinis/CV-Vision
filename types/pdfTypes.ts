type PDFTextItem = {
    R: {
        T: string;
    }[];
};

type PDFPage = {
    Texts: PDFTextItem[];
};

export type ParsedPDFData = {
    Pages: PDFPage[];
};