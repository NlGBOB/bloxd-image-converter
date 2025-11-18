import React from 'react';

const PreviewArea = ({
    image,
    resultImage,
    processing,
    progress,
    error,
    comparePosition,
    setComparePosition
}) => {
    return (
        <div className="result-card">
            <div className="result-header">
                <h3>Preview</h3>
                <div className="status-row">
                    {processing && <span className="status-badge processing">Processing {progress}%</span>}
                    {!processing && resultImage && <span className="status-badge success">Done</span>}
                </div>
            </div>

            <div className="canvas-area">
                {error && <div className="error-message">{error}</div>}

                {!image && !resultImage && (
                    <div className="empty-state">Upload an image to start</div>
                )}

                {image && resultImage && !processing && (
                    <div className="compare-container" style={{ '--pos': comparePosition }}>
                        <img src={resultImage} alt="Generated" className="img-base" />
                        <div className="img-overlay">
                            <img src={image} alt="Original" />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={comparePosition}
                            onChange={(e) => setComparePosition(e.target.value)}
                            className="compare-slider"
                        />
                        <div className="slider-line">
                            <div className="slider-button">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M15 18l-6-6 6-6" /><path d="M9 18l6-6-6-6" /></svg>
                            </div>
                        </div>
                        <div className="compare-label label-left" style={{ opacity: comparePosition > 10 ? 1 : 0 }}>Original</div>
                        <div className="compare-label label-right" style={{ opacity: comparePosition < 90 ? 1 : 0 }}>Generated</div>
                    </div>
                )}

                {image && (!resultImage || processing) && (
                    <div className="single-image-view">
                        <img src={image} alt="Original" style={{ opacity: processing ? 0.5 : 1 }} />
                        {processing && <div className="loader"></div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewArea;