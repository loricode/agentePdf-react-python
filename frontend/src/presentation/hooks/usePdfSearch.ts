import { useEffect, useState } from "react";
import { searchPdf } from "../../services/agenteService";
import { type PDF } from "../types/pdf";

type PdfState = {
    selectedPdf: PDF | null;
    query: string;
    open: boolean;
    results: PDF[];
};

export const usePdfSearch = () => {

    const [pdfState, setPdfState] =
        useState<PdfState>({
            selectedPdf: null,
            query: "",
            open: false,
            results: []
        });

    useEffect(() => {

        if (pdfState.query.length < 2) {

            setPdfState(prev => ({
                ...prev,
                results: []
            }));

            return;
        }

        const delay = setTimeout(async () => {

            const data = await searchPdf(
                pdfState.query
            );

            setPdfState(prev => ({
                ...prev,
                results: data,
                open: true
            }));

        }, 300);

        return () => clearTimeout(delay);

    }, [pdfState.query]);

    return {
        pdfState,
        setPdfState
    };
};