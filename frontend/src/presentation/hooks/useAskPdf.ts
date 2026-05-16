import { askPdfService } from "../../services/agenteService";

type Props = {
    textRef: React.RefObject<HTMLDivElement | null>;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useAskPdf = ({
    textRef,
    inputRef
}: Props) => {

    const askPdf = async ({
        idPdf = '',
        question = ''
    }) => {

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        const res = await askPdfService(
            question,
            idPdf
        );

        const reader = res.body!.getReader();

        const decoder = new TextDecoder();

        const div = document.createElement("div");

        div.className = `
            max-w-[75%]
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
            rounded-bl-md
        `;

        div.textContent = '';

        textRef.current?.appendChild(div);

        while (true) {

            const { done, value } =
                await reader.read();

            if (done) break;

            div.textContent =
                (div.textContent || "") +
                decoder.decode(value);

            if (textRef.current) {
                textRef.current.scrollTop =
                    textRef.current.scrollHeight;
            }
        }
    };

    return askPdf;
};