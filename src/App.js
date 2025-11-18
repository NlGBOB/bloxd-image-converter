import { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

import { defaultConfig, sliderToValue, ORIENTATION_CONFIG } from './constants';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ConfigurationPanel from './components/ConfigurationPanel';
import PreviewArea from './components/PreviewArea';
import CodeViewer from './components/CodeViewer';
import DownloadActions from './components/DownloadActions';

function App() {
  const [image, setImage] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [blueprint, setBlueprint] = useState(null);
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

        if (actualVal !== null) {
          if (newConfig.searchDepth === null || newConfig.searchDepth > actualVal) {
            newConfig.searchDepth = actualVal;
          }
        }

      } else if (name === 'searchDepth') {
        const sliderVal = parseInt(value, 10);
        let actualVal = sliderToValue(sliderVal);

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

  const handleReset = () => { setConfig(defaultConfig); }

  return (
    <div className="App">
      <Header />
      <main>
        <div className="controls">
          <ImageUploader
            image={image}
            onFileChange={processFile}
          />

          <ConfigurationPanel
            config={config}
            onConfigChange={handleConfigChange}
            onReset={handleReset}
          />
        </div>

        <div className="results">
          <PreviewArea
            image={image}
            resultImage={resultImage}
            processing={processing}
            progress={progress}
            error={error}
            comparePosition={comparePosition}
            setComparePosition={setComparePosition}
          />

          {blueprint && !processing && (
            <>
              <CodeViewer
                blueprint={blueprint}
                config={config}
              />

              <DownloadActions
                blueprint={blueprint}
                resultImage={resultImage}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;