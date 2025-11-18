import React from 'react';
import { ORIENTATION_CONFIG, valueToSlider } from '../constants';

const ConfigurationPanel = ({ config, onConfigChange, onReset }) => {
    const widthPresets = [32, 64, 96, 128, 160];
    const maxColorSliderVal = valueToSlider(config.maxColorCount);
    const searchDepthSliderVal = valueToSlider(config.searchDepth);

    const maxDepthAllowed = config.maxColorCount === null ? 11 : config.maxColorCount;

    return (
        <div className="control-section">
            <div className="section-header">
                <h2>2. Configure</h2>
                <button onClick={onReset} className="reset-link">Reset Defaults</button>
            </div>

            <div className="control-group">
                <div className="control-item">
                    <label htmlFor="outputWidth">Output Width</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="outputWidth"
                            name="outputWidth"
                            min="1"
                            value={config.outputWidth || ''}
                            onChange={onConfigChange}
                        />
                        <span className="unit">blocks</span>
                    </div>
                    <div className="preset-buttons">
                        {widthPresets.map(w => (
                            <button
                                key={w}
                                onClick={() => onConfigChange({ target: { name: 'outputWidth', value: w, type: 'number' } })}
                                className={config.outputWidth === w ? 'active' : ''}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="control-item">
                    <label htmlFor="outputHeight">Output Height <span className="optional">(Optional)</span></label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="outputHeight"
                            name="outputHeight"
                            min="1"
                            value={config.outputHeight || ''}
                            onChange={onConfigChange}
                            placeholder="Auto"
                        />
                        <span className="unit">blocks</span>
                    </div>
                </div>
            </div>

            <div className="control-item">
                <label htmlFor="buildOrientation">Build Orientation</label>
                <div className="select-wrapper">
                    <select
                        id="buildOrientation"
                        name="buildOrientation"
                        value={config.buildOrientation}
                        onChange={onConfigChange}
                    >
                        <optgroup label="Vertical Wall (Uses Side Textures)">
                            <option value="wall_north">Facing North (-Z)</option>
                            <option value="wall_south">Facing South (+Z)</option>
                            <option value="wall_east">Facing East (+X)</option>
                            <option value="wall_west">Facing West (-X)</option>
                        </optgroup>
                        <optgroup label="Horizontal Floor (Uses Top Textures)">
                            <option value="floor_north">Facing North (-Z)</option>
                            <option value="floor_south">Facing South (+Z)</option>
                            <option value="floor_east">Facing East (+X)</option>
                            <option value="floor_west">Facing West (-X)</option>
                        </optgroup>
                        <optgroup label="Horizontal Ceiling (Uses Bottom Textures)">
                            <option value="ceiling_north">Facing North (-Z)</option>
                            <option value="ceiling_south">Facing South (+Z)</option>
                            <option value="ceiling_east">Facing East (+X)</option>
                            <option value="ceiling_west">Facing West (-X)</option>
                        </optgroup>
                    </select>
                </div>
                <p className="control-description" style={{ color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                    {ORIENTATION_CONFIG[config.buildOrientation].desc}
                </p>
            </div>

            <div className="control-item">
                <div className="label-row">
                    <label htmlFor="maxVariance">Texture Color Variance</label>
                    <span className="value-badge">{config.maxVariance}</span>
                </div>
                <input
                    className="slider"
                    type="range"
                    id="maxVariance"
                    name="maxVariance"
                    min="0"
                    max="100"
                    value={config.maxVariance}
                    onChange={onConfigChange}
                />
                <p className="control-description">Lower values force blocks to be more solid-colored.</p>
            </div>

            <div className="control-item">
                <div className="label-row">
                    <label htmlFor="maxColorCount">Max Colors per Texture</label>
                    <span className="value-badge">
                        {maxColorSliderVal >= 11 ? 'Unlimited' : maxColorSliderVal}
                    </span>
                </div>
                <input
                    className="slider"
                    type="range"
                    id="maxColorCount"
                    name="maxColorCount"
                    min="1"
                    max="11"
                    step="1"
                    value={maxColorSliderVal}
                    onChange={onConfigChange}
                />
                <p className="control-description">Limits candidate blocks to those with simple palettes.</p>
            </div>

            <div className="control-item">
                <div className="label-row">
                    <label htmlFor="searchDepth">Color Matching Depth</label>
                    <span className="value-badge">
                        {searchDepthSliderVal >= 11 ? 'Unlimited' : searchDepthSliderVal}
                    </span>
                </div>
                <input
                    className="slider"
                    type="range"
                    id="searchDepth"
                    name="searchDepth"
                    min="1"
                    max={maxDepthAllowed}
                    step="1"
                    value={searchDepthSliderVal}
                    onChange={onConfigChange}
                />
                <p className="control-description">How many dominant colors to compare. Higher is more accurate but slower.</p>
            </div>

            <div className="control-item">
                <label className="checkbox-label" htmlFor="allowTransparency">
                    <input
                        type="checkbox"
                        id="allowTransparency"
                        name="allowTransparency"
                        checked={config.allowTransparency}
                        onChange={onConfigChange}
                    />
                    <span className="custom-checkbox">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    <span className="checkbox-text">Allow Transparent Blocks</span>
                </label>
            </div>
        </div>
    );
};

export default ConfigurationPanel;