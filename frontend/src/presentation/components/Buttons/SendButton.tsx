
type SendButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const SendButton = ({ onClick }: SendButtonProps) => {

    return (
        <button onClick={onClick}
            className="
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    bg-blue-600
    hover:bg-blue-500
    active:scale-95
    transition
    text-white
  "
        >
            ➤
        </button>
    )
}