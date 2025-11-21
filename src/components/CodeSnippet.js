import React, { useState, useEffect, useRef } from 'react';

const CodeSnippet = ({ label, code, chunkInfo, resultImage, isSetup }) => {
    const [copied, setCopied] = useState(false);
    const [hasBeenCopied, setHasBeenCopied] = useState(false);
    const canvasRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setHasBeenCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (!chunkInfo || !resultImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { totalWidth, totalHeight, start, length } = chunkInfo;

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.onload = () => {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(img, 0, 0, totalWidth, totalHeight);

            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, totalWidth, totalHeight);

            ctx.fillStyle = '#6366f1';

            for (let i = 0; i < length; i++) {
                const globalIndex = start + i;
                const x = globalIndex % totalWidth;
                const y = Math.floor(globalIndex / totalWidth);
                ctx.fillRect(x, y, 1, 1);
            }
        };
        img.src = resultImage;

    }, [chunkInfo, resultImage]);

    return (
        <div className={`code-snippet-container ${hasBeenCopied ? 'history-copied' : ''}`}>
            {!isSetup && (
                <div className="snippet-preview">
                    <canvas ref={canvasRef} className="preview-canvas" />
                </div>
            )}
            <div className="snippet-content">
                <div className="code-header">
                    <span className="code-label">{label}</span>
                </div>
                <div className="code-row">
                    <div className="code-block-wrapper">
                        <pre className="code-block">
                            <code>{code}</code>
                        </pre>
                    </div>
                    <button
                        className={`copy-btn-inline ${copied ? 'copied' : ''} ${hasBeenCopied ? 'history-success' : ''}`}
                        onClick={handleCopy}
                    >
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeSnippet;