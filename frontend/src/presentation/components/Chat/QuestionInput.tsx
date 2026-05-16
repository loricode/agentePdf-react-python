import { type RefObject } from "react";
import { SendButton } from "../Buttons/SendButton";

type Props = {
    inputRef: RefObject<HTMLTextAreaElement | null>;
    onSend: () => void;
    onKeyDown: (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => void;
    autoResize: () => void;
};

export const QuestionInput = ({
    inputRef,
    onSend,
    onKeyDown,
    autoResize
}: Props) => {

    return (
        <div className="flex gap-2 items-center w-full max-w-md">

            <textarea
                ref={inputRef}
                rows={1}
                placeholder="Pregunta algo..."
                onKeyDown={onKeyDown}
                onInput={autoResize}
                className="
                px-4
                    py-3
                    rounded-xl
                    bg-zinc-900
                    text-white
                resize-none overflow-hidden w-full"
            />

            <SendButton onClick={onSend} />

        </div>
    );
};

 