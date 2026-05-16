import { type Dispatch, type SetStateAction } from "react";

import { type PDF } from "../../types/pdf";

type PdfState = {
    selectedPdf: PDF | null;
    query: string;
    open: boolean;
    results: PDF[];
};

type Props = {
    pdfState: PdfState;
    setPdfState: Dispatch<
        SetStateAction<PdfState>
    >;
};

export const PdfSearch = ({
    pdfState,
    setPdfState
}: Props) => {

    return (

        <div className="w-full max-w-md relative">

            <input
                value={pdfState.query}
                onChange={(e) =>
                    setPdfState(prev => ({
                        ...prev,
                        query: e.target.value
                    }))
                }
                placeholder="Buscar PDF..."
                className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-zinc-900
                    text-white
                    border
                    border-zinc-700
                "
                onFocus={() =>
                    setPdfState(prev => ({
                        ...prev,
                        open: true
                    }))
                }
            />

            {pdfState.open &&
                pdfState.results.length > 0 &&
                !pdfState.selectedPdf && (

                    <div
                        className="
                            absolute
                            w-full
                            mt-2
                            bg-zinc-900
                            border
                            border-zinc-700
                            rounded-xl
                            overflow-hidden
                            shadow-lg
                            z-50
                        "
                    >

                        {pdfState.results.map((pdf) => (

                            <div
                                key={pdf.pdf_uuid}
                                onClick={() => {

                                    setPdfState(prev => ({
                                        ...prev,
                                        selectedPdf: pdf,
                                        query: pdf.name,
                                        open: false
                                    }));

                                }}
                                className="
                                    px-4
                                    py-3
                                    hover:bg-zinc-800
                                    cursor-pointer
                                    text-white
                                "
                            >
                                {pdf.name}
                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
};