import { useRef, useState, useEffect } from 'react';
import { askPdfService, searchPdf } from '../services/agenteService';
import { SendButton } from './components/Buttons/SendButton';
import { usePdfSearch } from './hooks/usePdfSearch';

export default function AppVirtualAgent() {

    const textRef = useRef<HTMLDivElement | null>(null);
    const { pdfState, setPdfState } = usePdfSearch();

    const [messages, setMessages] = useState([]);

    const inputRef =
        useRef<HTMLTextAreaElement | null>(null);

  
    const addQuestion = (message: string | undefined) => {

        if (!message) return

        const div = document.createElement("div");

        div.className = `   max-w-[75%]
    px-5
    py-3
    rounded-2xl
    text-white
    whitespace-pre-wrap
    break-words
    shadow-lg
    text-[15px]
    leading-relaxed   bg-blue-600
        rounded-br-md`
        div.textContent = message;
        textRef.current?.appendChild(div);

    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (e.altKey && e.key === "Enter") {

            e.preventDefault();

            if (!inputRef.current) return;

            const textarea = inputRef.current;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = textarea.value;

            // insertar salto de línea
            textarea.value =
                value.substring(0, start) +
                "\n" +
                value.substring(end);

            textarea.selectionStart =
                textarea.selectionEnd =
                start + 1;

            textarea.style.height = "auto";
            textarea.style.height =
                textarea.scrollHeight + "px";
        }
    };

    const autoResize = () => {

        if (!inputRef.current) return;

        const textarea = inputRef.current;

        textarea.style.height = "auto";

        textarea.style.height =
            textarea.scrollHeight + "px";
    };

    const askPdf = async ({ idPdf = '', question = '' }) => {
     
        if(inputRef.current){
            inputRef.current.value = '';
        }
        
        const res = await askPdfService(question, idPdf);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        const div = document.createElement("div");
        div.className = `max-w-[75%]
    px-5
    py-3
    rounded-2xl
    text-white
    whitespace-pre-wrap
    break-words
    shadow-lg
    text-[15px]
    leading-relaxed 
    bg-zinc-800
    rounded-bl-md`
        div.textContent = '';
        textRef.current?.appendChild(div);

        while (true) {

            const { done, value } = await reader.read();

            if (done) {
                
                break;
            }

            if (textRef.current) {
                div.textContent =
                    (div.textContent || "") + decoder.decode(value);

                textRef.current.scrollTop =
                    textRef.current.scrollHeight;
            }

        }
    };

    const uploadPdf = async (
        file: File
    ) => {

        if (!file) return;

        const formData = new FormData();

        formData.append(
            "email",
            "user@gmail.com"
        );

        formData.append(
            "file",
            file
        );

        const response = await fetch(
            "http://localhost:8000/upload-pdf",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        console.log(data);
    };


    return (
        <div className='min-h-screen flex justify-center items-center flex-col gap-4'>

            <h1>Resumen</h1>

            <div className="w-full max-w-md">
                <label
                    htmlFor="pdf-upload"
                    className="
      flex
      flex-col
      items-center
      justify-center
      w-full
      h-40
      border-2
      border-dashed
      rounded-2xl
      cursor-pointer
      transition
      bg-zinc-900
      border-zinc-700
      hover:border-blue-500
      hover:bg-zinc-800
    "
                >
                    <svg
                        className="w-10 h-10 mb-3 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                        />
                    </svg>

                    <p className="text-sm text-zinc-300">
                        Click para subir PDF
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                        PDF hasta 10MB
                    </p>

                    <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            uploadPdf(file!);
                        }}
                    />
                </label>
            </div>


            {pdfState.selectedPdf && (
                <div className="mt-3 text-sm text-green-400">
                    PDF seleccionado: {pdfState.selectedPdf.name}
                </div>
            )}

            <div className="w-full max-w-md relative">

                {/* INPUT */}
                <input
                    value={pdfState.query}
                    onChange={(e) => setPdfState(prev => ({ ...prev, query: e.target.value }))}
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
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
                    onFocus={() => setPdfState(prev => ({ ...prev, open: true }))}
                />

                {/* DROPDOWN */}
                {pdfState.open && pdfState.results.length > 0 && !pdfState.selectedPdf && (
                    <div className="
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
        ">
                        {pdfState.results.map((pdf) => (
                            <div
                                key={pdf.pdf_uuid}
                                onClick={() => {
                                    setPdfState(prev => ({
                                        ...prev,
                                        selectedPdf: pdf,
                                        query: pdf.name,
                                        open: false,
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

            <div className="flex gap-2 items-center w-full max-w-md">

                <textarea
                    id='areaQuestion'
                    ref={inputRef}
                    rows={1}
                    placeholder="Pregunta algo..."
                    onKeyDown={handleKeyDown}
                    onInput={autoResize}
                    className="
                      resize-none
    overflow-hidden
          w-full
          max-w-2xl
          min-h-[56px]
          max-h-[300px]
          resize-none
          px-2
          py-4
          rounded-2xl
          bg-[#2f2f2f]
          text-white
          placeholder:text-zinc-400
          outline-none
          transition-all
          focus:ring-4
          focus:ring-zinc-800
        "
                />

                <SendButton onClick={() => {
                    askPdf({ idPdf: pdfState.selectedPdf?.pdf_uuid, question: inputRef.current?.value })
                    addQuestion(inputRef.current?.value);
                }

                } />

            </div>


            <div
                className='
                
    flex
    flex-col
    gap-4
    p-4
    rounded-2xl'
                ref={textRef}
                style={{
                    fontSize: "20px",
                    whiteSpace: "pre-wrap",
                }}
            />


        </div>
    );
}

type PDF = {
    pdf_uuid: string;
    name: string;
};
