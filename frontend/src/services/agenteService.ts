const URL_API = "http://localhost:8000"

export const searchPdf = async (query:string) => {

    const res = await fetch(
        `${URL_API}/search-pdfs?q=${query}`
    );

    return await res.json();
}

export const askPdfService = async (question:string, idPdf:string) => {
     return await fetch(`${URL_API}/ask-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: question,
                pdf_uuid: idPdf
            }),
        });
}