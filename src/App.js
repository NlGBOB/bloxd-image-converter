
import { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const defaultConfig = {
  outputWidth: 128,
  outputHeight: null,
  faceDirection: "front",
  buildOrientation: "wall_north",
  maxVariance: 20,
  maxColorCount: null,
  searchDepth: Infinity,
  allowTransparency: false,
  TEXTURE_SIZE: 8,
};

// Setup code defines S (Scheduler) and B (Block Palette)
const SETUP_CODE = `S={t:{},g:{},c:0,o:0,i:0,d:{get 1(){let t=S.t[S.c];do{let e=3*S.i,l=t[e+1],o=t[e+2],i=S.g[l];[t[e],t=>t][+(o<i)]()}while(++S.i<t.length/3)}},run(t,e,l){let o=S.c-~e-1,i=S.t[o]=[[],S.t[o]][+!!S.t[o]];i[i.length]=t,i[i.length]=["0",l][+!!l],i[i.length]=S.o++},stop(t){S.g[t]=S.o++}},tick=()=>{S.d[+!!S.t[S.c]],delete S.t[S.c++],S.i=0},S.run((()=>{globalThis.B={};let t=[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,147,164,165,166,167,168,169,170,171,172,203,204,205,206,207,208,209,210,211,212,213,214,223,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,317,318,319,320,321,322,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,650,651,652,653,654,906,907,908,909,910,911,937,938,945,946,947,948,949,950,951,958,959,960,961,962,975,976,977,978,979,980,981,982,983,990,991,992,993,994,995,996,997,998,999,1e3,1001,1002,1003,1004,1005,1006,1007,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1108,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120,1121,1122,1123,1124,1221,1222,1223,1224,1225,1226,1258,1259,1270,1271,1272,1279,1291,1292,1293,1294,1295,1296,1297,1298,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1352,1353,1354,1355,1356,1357,1358,1359,1360,1494,1510,1511,1512,1513,1514,1515,1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533,1534,1535,1536,1537,1538,1539,1540,1541,1542,1543,1544,1545,1546,1547,1548,1549,1550,1551,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1562,1563,1564,1565,1566,1567,1568,1569,1570,1571,1572,1573,1574,1575,1576,1577,1578,1579,1580,1581,1582,1583,1584,1585,1586,1587,1588,1589,1590,1591,1592,1593,1594,1595,1596,1597,1598,1599,1600,1601,1602,1603,1604,1605,1606,1607,1608,1609,1610,1611,1612,1613,1614,1615,1616,1617,1618,1619,1620,1621,1628,1629,1630,1632,1633,1634,1635,1636,1662,1663,1694,1704,1705,1706,1707,1708,1717,1722,1723,1724,1725,1726,1727,1728,1729,1730,1731,1732,1733,1734,1735,1736,1737,1738,1739,1740,1741,1742,1743,1744,1745,1746,1747,1748,1749,1750,1751,1752,1753,1754,1955,1965,1966,1967,1968,1969,1995,1996,2007,2008,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2045,2046,2085,2086,2088,2089,2090,2091,2092,2093,2095,2097,2507,2508,2509,2510,2511,2512];let S=0;do{B[b=t[S++]]=api.blockIdToBlockName(b)}while(t[S])}));`;

const sliderToValue = (val) => (val >= 11 ? null : val);
const valueToSlider = (val) => (val === null || val === Infinity ? 11 : val);

const ORIENTATION_CONFIG = {
  wall_north: {
    face: "front",
    desc: "Vertical Wall. You face North (-Z). Builds to your RIGHT (West/-X)."
  },
  wall_south: {
    face: "front",
    desc: "Vertical Wall. You face South (+Z). Builds to your RIGHT (East/+X)."
  },
  wall_east: {
    face: "front",
    desc: "Vertical Wall. You face East (+X). Builds to your RIGHT (North/-Z)."
  },
  wall_west: {
    face: "front",
    desc: "Vertical Wall. You face West (-X). Builds to your RIGHT (South/+Z)."
  },
  floor_north: {
    face: "top",
    desc: "Horizontal Floor. You face North (-Z). Image builds FORWARD (-Z) and RIGHT (-X)."
  },
  floor_south: {
    face: "top",
    desc: "Horizontal Floor. You face South (+Z). Image builds FORWARD (+Z) and RIGHT (+X)."
  },
  floor_east: {
    face: "top",
    desc: "Horizontal Floor. You face East (+X). Image builds FORWARD (+X) and RIGHT (-Z)."
  },
  floor_west: {
    face: "top",
    desc: "Horizontal Floor. You face West (-X). Image builds FORWARD (-X) and RIGHT (+Z)."
  },
  ceiling_north: {
    face: "bottom",
    desc: "Horizontal Ceiling. You face North (-Z). Image builds FORWARD (-Z) and LEFT (+X) (Mirrored for look-up)."
  },
  ceiling_south: {
    face: "bottom",
    desc: "Horizontal Ceiling. You face South (+Z). Image builds FORWARD (+Z) and LEFT (-X) (Mirrored for look-up)."
  },
  ceiling_east: {
    face: "bottom",
    desc: "Horizontal Ceiling. You face East (+X). Image builds FORWARD (+X) and LEFT (+Z) (Mirrored for look-up)."
  },
  ceiling_west: {
    face: "bottom",
    desc: "Horizontal Ceiling. You face West (-X). Image builds FORWARD (-X) and LEFT (-Z) (Mirrored for look-up)."
  },
};

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

function App() {
  const [image, setImage] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [comparePosition, setComparePosition] = useState(100);
  const [config, setConfig] = useState(defaultConfig);
  const workerRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));
    setSourceFile(file);
    setResultImage(null);
    setBlueprint(null);
    setError('');
    setComparePosition(100);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

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
        processFile(file);
      } else {
        setError('Please drop a valid image file.');
      }
    }
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;

    setConfig(prev => {
      let newConfig = { ...prev };

      if (type === 'checkbox') {
        newConfig[name] = checked;
      } else if (name === 'maxColorCount') {
        const sliderVal = parseInt(value, 10);
        const actualVal = sliderToValue(sliderVal);
        newConfig.maxColorCount = actualVal;

        // Constraint: Depth cannot exceed Max Colors
        if (actualVal !== null) {
          if (newConfig.searchDepth === null || newConfig.searchDepth > actualVal) {
            newConfig.searchDepth = actualVal;
          }
        }

      } else if (name === 'searchDepth') {
        const sliderVal = parseInt(value, 10);
        let actualVal = sliderToValue(sliderVal);

        // Constraint: Depth cannot exceed Max Colors
        if (newConfig.maxColorCount !== null) {
          if (actualVal === null || actualVal > newConfig.maxColorCount) {
            actualVal = newConfig.maxColorCount;
          }
        }
        newConfig.searchDepth = actualVal;

      } else if (name === 'buildOrientation') {
        newConfig.buildOrientation = value;
        newConfig.faceDirection = ORIENTATION_CONFIG[value].face;
      } else if (type === 'number' || type === 'range') {
        if (value === '' && name === 'outputHeight') {
          newConfig[name] = null;
        } else {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            newConfig[name] = numValue;
          }
        }
      } else {
        newConfig[name] = value;
      }

      return newConfig;
    });
  };

  const handleGenerate = useCallback(() => {
    if (!sourceFile) return;
    setProcessing(true);
    setProgress(0);
    setError('');

    if (workerRef.current) {
      workerRef.current.terminate();
    }
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'progress') {
        setProgress(data);
      } else if (type === 'result') {
        setResultImage(data.image);
        setBlueprint({ data: data.blueprintData, config: data.blueprintConfig });
        setProcessing(false);
        worker.terminate();
      } else if (type === 'error') {
        setError(`Worker Error: ${data}`);
        setProcessing(false);
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      setError(`Worker Error: ${err.message}`);
      setProcessing(false);
      worker.terminate();
    };

    sourceFile.arrayBuffer().then(buffer => {
      worker.postMessage({ fileBuffer: buffer, config }, [buffer]);
    }).catch(err => {
      setError(`Failed to read file: ${err.message}`);
      setProcessing(false);
      if (workerRef.current) workerRef.current.terminate();
    });

  }, [sourceFile, config]);

  useEffect(() => {
    if (!sourceFile) return;
    const handler = setTimeout(() => { handleGenerate(); }, 600);
    return () => { clearTimeout(handler); };
  }, [config, sourceFile, handleGenerate]);

  const createDownloadLink = (data) => {
    const blob = new Blob([data], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }

  const handleReset = () => { setConfig(defaultConfig); }

  const getDynamicCode = () => {
    if (!blueprint) return [];
    const { width, height } = JSON.parse(blueprint.config);

    let coordLogic = "";

    switch (config.buildOrientation) {
      case "wall_north":
        coordLogic = "x-(i%w),y+h-((i/w)|0),z";
        break;
      case "wall_south":
        coordLogic = "x+(i%w),y+h-((i/w)|0),z";
        break;
      case "wall_east":
        coordLogic = "x,y+h-((i/w)|0),z-(i%w)";
        break;
      case "wall_west":
        coordLogic = "x,y+h-((i/w)|0),z+(i%w)";
        break;
      case "floor_north":
        coordLogic = "x-(i%w),y+1,z-(h-1-((i/w)|0))";
        break;
      case "floor_south":
        coordLogic = "x+(i%w),y+1,z+(h-1-((i/w)|0))";
        break;
      case "floor_east":
        coordLogic = "x+(h-1-((i/w)|0)),y+1,z-(i%w)";
        break;
      case "floor_west":
        coordLogic = "x-(h-1-((i/w)|0)),y+1,z+(i%w)";
        break;
      case "ceiling_north":
        coordLogic = "x+(i%w),y+1,z-(h-1-((i/w)|0))";
        break;
      case "ceiling_south":
        coordLogic = "x-(i%w),y+1,z+(h-1-((i/w)|0))";
        break;
      case "ceiling_east":
        coordLogic = "x+(h-1-((i/w)|0)),y+1,z+(i%w)";
        break;
      case "ceiling_west":
        coordLogic = "x-(h-1-((i/w)|0)),y+1,z-(i%w)";
        break;
      default:
        coordLogic = "x-(i%w),y+h-((i/w)|0),z";
    }

    const MAX_CHARS = 15000;
    const OVERHEAD = 250;
    const parts = [];

    let currentChunk = [];
    let currentLen = 0;
    let currentOffset = 0;

    for (let i = 0; i < blueprint.data.length; i++) {
      const numStr = blueprint.data[i].toString();
      if (currentLen + numStr.length + 1 > MAX_CHARS - OVERHEAD) {
        const chunkStr = currentChunk.join(',');
        const code = `let s=[${chunkStr}],w=${width},h=${height},o=${currentOffset},[x,y,z]=thisPos;(f=_=>{let c=128,i;do{if(_>=s.length)return;i=o+_;api.setBlock(${coordLogic},B[s[]]);_++}while(--c);S.run(()=>f(_),1,'b'+o)})(0)`;

        parts.push({
          label: `2.${parts.length + 1} Build Part ${parts.length + 1}`,
          code: code
        });

        // Reset for next chunk
        currentOffset += currentChunk.length;
        currentChunk = [];
        currentLen = 0;
      }
      currentChunk.push(numStr);
      currentLen += numStr.length + 1;
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
      const chunkStr = currentChunk.join(',');
      const code = `let s=[${chunkStr}],w=${width},h=${height},o=${currentOffset},[x,y,z]=thisPos;(f=_=>{let c=128,i;do{if(_>=s.length)return;i=o+_;api.setBlock(${coordLogic},B[s[_]]);_++}while(--c);S.run(()=>f(_),1,'b'+o)})(0)`;

      parts.push({
        label: parts.length > 0 ? `2.${parts.length + 1} Build Part ${parts.length + 1} (Final)` : `2. Build Command`,
        code: code
      });
    }

    return parts;
  };

  const widthPresets = [32, 64, 96, 128, 160];
  const maxColorSliderVal = valueToSlider(config.maxColorCount);
  const searchDepthSliderVal = valueToSlider(config.searchDepth);

  // Calculate max allowed value for the depth slider
  const maxDepthAllowed = config.maxColorCount === null ? 11 : config.maxColorCount;

  return (
    <div className="App">
      <header>
        <h1>Bloxelizer</h1>
        <p className="subtitle">Convert images into Minecraft block blueprints</p>
      </header>
      <main>
        <div className="controls">
          <div className="control-section">
            <h2>1. Source Image</h2>
            <div
              className={`drop-zone ${isDraggingFile ? 'dragging' : ''} ${image ? 'has-image' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} />
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
          </div>

          <div className="control-section">
            <div className="section-header">
              <h2>2. Configure</h2>
              <button onClick={handleReset} className="reset-link">Reset Defaults</button>
            </div>

            <div className="control-group">
              <div className="control-item">
                <label htmlFor="outputWidth">Output Width</label>
                <div className="input-group">
                  <input type="number" id="outputWidth" name="outputWidth" min="1" value={config.outputWidth || ''} onChange={handleConfigChange} />
                  <span className="unit">blocks</span>
                </div>
                <div className="preset-buttons">
                  {widthPresets.map(w => (
                    <button key={w} onClick={() => setConfig(c => ({ ...c, outputWidth: w }))} className={config.outputWidth === w ? 'active' : ''}>{w}</button>
                  ))}
                </div>
              </div>

              <div className="control-item">
                <label htmlFor="outputHeight">Output Height <span className="optional">(Optional)</span></label>
                <div className="input-group">
                  <input type="number" id="outputHeight" name="outputHeight" min="1" value={config.outputHeight || ''} onChange={handleConfigChange} placeholder="Auto-calculated" />
                  <span className="unit">blocks</span>
                </div>
              </div>
            </div>

            <div className="control-item">
              <label htmlFor="buildOrientation">Build Orientation</label>
              <div className="select-wrapper">
                <select id="buildOrientation" name="buildOrientation" value={config.buildOrientation} onChange={handleConfigChange}>
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
              <input className="slider" type="range" id="maxVariance" name="maxVariance" min="0" max="100" value={config.maxVariance} onChange={handleConfigChange} />
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
                onChange={handleConfigChange}
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
                onChange={handleConfigChange}
              />
              <p className="control-description">How many dominant colors to compare. Higher is more accurate but slower.</p>
            </div>

            <div className="control-item">
              <label className="checkbox-label" htmlFor="allowTransparency">
                <input type="checkbox" id="allowTransparency" name="allowTransparency" checked={config.allowTransparency} onChange={handleConfigChange} />
                <span className="custom-checkbox">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span className="checkbox-text">Allow Transparent Blocks</span>
              </label>
            </div>
          </div>
        </div>

        <div className="results">
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

            {blueprint && !processing && (
              <>
                <div className="code-section">
                  <div className="code-section-header">
                    <h3>Game Code</h3>
                    <p>Copy these snippets into your game console to build the image.</p>
                  </div>

                  <CodeSnippet
                    label="1. One-Time Setup (Run once per world)"
                    code={SETUP_CODE}
                  />

                  {getDynamicCode().map((item, idx) => (
                    <CodeSnippet
                      key={idx}
                      label={item.label}
                      code={item.code}
                    />
                  ))}
                </div>

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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;