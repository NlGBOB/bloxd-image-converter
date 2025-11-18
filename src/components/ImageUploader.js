import React, { useState } from 'react';

const ImageUploader = ({ image, onFileChange }) => {
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onFileChange(file);
            } else {
                alert('Please drop a valid image file.');
            }
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div className="control-section">
            <h2 style={{ marginBottom: "10px" }}>1. Source Image</h2>
            <div
                className={`drop-zone ${isDraggingFile ? 'dragging' : ''} ${image ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input type="file" id="fileInput" accept="image/*" onChange={handleInputChange} />
                <label htmlFor="fileInput">
                    {image ? (
                        <div className="preview-thumb">
                            <img src={image} alt="Preview" />
                            <span>Change Image</span>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <span className="icon">📁</span>
                            <strong>Click to upload</strong>
                            <span>or drag and drop here</span>
                        </div>
                    )}
                </label>
            </div>
        </div >
    );
};

export default ImageUploader;