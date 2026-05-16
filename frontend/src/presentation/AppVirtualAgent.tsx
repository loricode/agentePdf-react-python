import { useRef, useState, useEffect } from 'react';
import { askPdfService, searchPdf } from '../services/agenteService';
import { SendButton } from './components/Buttons/SendButton';
import { usePdfSearch } from './hooks/usePdfSearch';
import { useAutoResize } from './hooks/useAutoResize';
import { ChatMessages } from './components/Chat/ChatMessages';
import { QuestionInput } from './components/Chat/QuestionInput';
import { PdfSearch } from './components/Pdf/PdfSearch';
import { PdfUploader } from './components/Pdf/PdfUploader';
import { useAskPdf } from './hooks/useAskPdf';

export default function AppVirtualAgent() {

    const textRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [messages, setMessages] = useState([]);
    
    const { pdfState, setPdfState } = usePdfSearch();

    const askPdf = useAskPdf({ textRef, inputRef });

    const autoResize = useAutoResize(inputRef);

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
    leading-relaxed 
    bg-blue-600
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

           <PdfUploader onUpload={uploadPdf} />

            {pdfState.selectedPdf && (
                <div className="mt-3 text-sm text-green-400">
                    PDF seleccionado: {pdfState.selectedPdf.name}
                </div>
            )}

          <PdfSearch pdfState={pdfState} setPdfState={setPdfState}/>

            <QuestionInput
                onKeyDown={handleKeyDown}
                onSend={() => {
                    if(inputRef.current?.value){
                      addQuestion(inputRef.current?.value);
                      askPdf({ idPdf: pdfState.selectedPdf?.pdf_uuid, question: inputRef.current?.value })
                    }
                }}
                autoResize={autoResize}
                inputRef={inputRef} />

            <ChatMessages textRef={textRef} />

        </div>
    );
}