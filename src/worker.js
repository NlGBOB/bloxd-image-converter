self.onmessage = async (event) => {
    const { fileBuffer, config } = event.data;
    try {
        const { runBloxelizer } = await import('./bloxelizerLogic.js');
        const onProgress = (progress) => {
            self.postMessage({ type: 'progress', data: progress });
        };
        const result = await runBloxelizer(fileBuffer, config, onProgress);
        self.postMessage({ type: 'result', data: result });
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({ type: 'error', data: error.message || error.toString() });
    }
};