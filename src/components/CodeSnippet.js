import React, { useState } from 'react';

const CodeSnippet = ({ label, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-snippet-container">
            <div className="code-header">
                <span className="code-label">{label}</span>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <div className="code-block-wrapper">
                <pre className="code-block">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeSnippet;