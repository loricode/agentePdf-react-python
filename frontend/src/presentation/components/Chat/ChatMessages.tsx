import { type RefObject } from "react";

type Props = {
    textRef: RefObject<HTMLDivElement | null>;
};

export const ChatMessages = ({
    textRef
}: Props) => {

    return (
        <div
            ref={textRef}
            className="
                flex
                flex-col
                gap-4
                p-4
                rounded-2xl
            "
        />
    );
};