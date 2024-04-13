"use client"
import React, { useState } from 'react';

function UploadPDF() {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    
    const handleFileChange = async (event) => {
        const reader = new FileReader();
        const file = event.target.files[0];
        setFileName(file.name);

        reader.onloadend = () => {
            // Convert the PDF to Base64
            const base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");

            setFile(base64String);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(file)
    };

    const downloadFile = async (e) => {
        const downloadLink = document.createElement("a");
  
        downloadLink.href = base64String;
        
        downloadLink.download = "convertedPDFFile.pdf";
        
        downloadLink.click();
        
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload PDF</button>
            </form>
            <form onSubmit={downloadFile}>
                <button type="submit">Download PDF</button>
            </form>
        </div>
    );
}

export default UploadPDF;