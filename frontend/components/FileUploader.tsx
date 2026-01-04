import React, { useState, useRef } from 'react';

interface FileUploaderProps {
    label: string;
    onFileSelect: (file: File) => void;
    accept?: string;
    disabled?: boolean;
}

export default function FileUploader({ label, onFileSelect, accept = ".pdf,.txt,.doc,.docx", disabled = false }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setFileName(file.name);
        onFileSelect(file);
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={!disabled ? handleDrop : undefined}
                onClick={!disabled ? onButtonClick : undefined}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className={`w-8 h-8 mb-3 ${fileName ? "text-green-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        {fileName ? (
                            <span className="font-semibold text-green-600">{fileName}</span>
                        ) : (
                            <>
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </>
                        )}
                    </p>
                    <p className="text-xs text-gray-400">{accept.replace(/,/g, ', ')}</p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
