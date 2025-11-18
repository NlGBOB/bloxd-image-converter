import React from 'react';

const DownloadActions = ({ blueprint, resultImage }) => {
    const createDownloadLink = (data) => {
        const blob = new Blob([data], { type: 'text/plain' });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="actions-footer">
            <div className="download-group">
                <h4>Download Files</h4>
                <div className="button-row">
                    <a href={createDownloadLink(blueprint.data.join(','))} download="blueprint.txt" className="btn primary">
                        <span className="icon">📄</span> .txt
                    </a>
                    <a href={createDownloadLink(blueprint.config)} download="blueprint.json" className="btn secondary">
                        <span className="icon">⚙️</span> .json
                    </a>
                    <a href={resultImage} download="bloxelized.png" className="btn outline">
                        <span className="icon">🖼️</span> .png
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DownloadActions;