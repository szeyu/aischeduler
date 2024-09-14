// src/components/CSVUploader.tsx
import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { cleanData } from '../utils/dataCleaner';
import './CSVUploader.css';

interface CSVUploaderProps {
  onDataProcessed: (data: any[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleUpload = () => {
    if (file) {
        Papa.parse(file, {
            complete: (result) => {
                console.log("Papa Parse result:", result);
                const cleanedData = cleanData(result.data);
                console.log("Cleaned data:", cleanedData);
                onDataProcessed(cleanedData);
            },
            header: false,
            dynamicTyping: true,
        });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="csv-uploader">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button onClick={handleButtonClick} className="file-select-button">
        {file ? file.name : 'Choose File'}
      </button>
      <button onClick={handleUpload} disabled={!file} className="upload-button">
        Upload and Process
      </button>
    </div>
  );
};

export default CSVUploader;