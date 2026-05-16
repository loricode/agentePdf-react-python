import { type RefObject } from "react";

export const useAutoResize = (
    ref: RefObject<HTMLTextAreaElement | null>
) => {

    const autoResize = () => {

        if (!ref.current) return;

        ref.current.style.height = "auto";

        ref.current.style.height =
            ref.current.scrollHeight + "px";
    };

    return autoResize;
};