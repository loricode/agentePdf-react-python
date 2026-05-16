type Props = {
    onUpload: (file: File) => void;
};

export const PdfUploader = ({
    onUpload
}: Props) => {

    return (
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
                            onUpload(file!);
                        }}
                    />
                </label>
            </div>
    );
};