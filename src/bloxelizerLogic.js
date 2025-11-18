let atlasCache = {};
let textureImageCache = {};

function clearCaches() {
    atlasCache = {};
    textureImageCache = {};
}

function colorDistance(rgb1, rgb2) {
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function hexToRgb(hex) {
    if (hex === '#transparent') return null;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function calculatePerceivedColor(texture, depth) {
    let totalR = 0, totalG = 0, totalB = 0;
    let totalPixels = 0;
    const limit = Math.min(depth, texture.colorHexes.length);
    for (let i = 0; i < limit; i++) {
        const hex = texture.colorHexes[i];
        const count = texture.colorPixelCounts[i];
        const rgb = hexToRgb(hex);
        if (rgb) {
            totalR += rgb.r * count;
            totalG += rgb.g * count;
            totalB += rgb.b * count;
            totalPixels += count;
        }
    }
    if (totalPixels === 0) return null;
    return { r: Math.round(totalR / totalPixels), g: Math.round(totalG / totalPixels), b: Math.round(totalB / totalPixels) };
}

function calculateColorVariance(texture) {
    if (!texture.colorHexes || texture.colorHexes.length <= 1) return 0;

    const firstColor = hexToRgb(texture.colorHexes[0]);
    if (!firstColor) return 0;

    let totalWeightedDistance = 0;
    let totalPixels = 0;

    for (let i = 0; i < texture.colorHexes.length; i++) {
        const hex = texture.colorHexes[i];
        const count = texture.colorPixelCounts?.[i] || 1;
        const rgb = hexToRgb(hex);
        if (rgb) {
            const distance = colorDistance(rgb, firstColor);
            totalWeightedDistance += distance * count;
            totalPixels += count;
        }
    }

    if (totalPixels === 0) return 0;
    return totalWeightedDistance / totalPixels;
}

async function loadAndPrepareCandidates(textureData, CONFIG) {
    console.log('Loading candidates with config:', CONFIG);

    const faceIndex = textureData.face_index?.[CONFIG.faceDirection];
    if (!faceIndex) {
        console.warn(`Face direction "${CONFIG.faceDirection}" not found. Available faces:`, Object.keys(textureData.face_index || {}));
        const allTextureIds = new Set();
        Object.values(textureData.face_index || {}).forEach(ids => ids.forEach(id => allTextureIds.add(id)));
        if (allTextureIds.size === 0) {
            throw new Error('No valid face directions found in texture data');
        }
        console.log('Using all available textures as fallback');
    }

    const validTextureIdsForFace = faceIndex ? new Set(Object.values(faceIndex).flat()) : new Set();
    const candidates = [];

    console.log(`Total textures available: ${textureData.texture_palette.length}`);

    for (const texture of textureData.texture_palette) {
        if (faceIndex && !validTextureIdsForFace.has(texture.textureId)) {
            continue;
        }

        if (CONFIG.maxColorCount !== undefined && CONFIG.maxColorCount !== null &&
            texture.colorCount > CONFIG.maxColorCount) {
            continue;
        }

        if (!CONFIG.allowTransparency && texture.hasTransparency) {
            continue;
        }

        if (CONFIG.maxVariance !== undefined && CONFIG.maxVariance !== null && CONFIG.maxVariance >= 0) {
            const variance = calculateColorVariance(texture);
            if (variance > CONFIG.maxVariance) {
                continue;
            }
        }

        const perceivedColor = calculatePerceivedColor(texture, CONFIG.searchDepth ?? Infinity);
        if (perceivedColor) {
            candidates.push({
                textureInfo: texture,
                perceivedColor: perceivedColor,
                variance: calculateColorVariance(texture)
            });
        }
    }

    console.log(`Found ${candidates.length} candidate textures after filtering`);
    if (candidates.length === 0) {
        console.error('No candidate textures found with current filters. Available textures:', textureData.texture_palette.slice(0, 5));
        throw new Error('No candidate textures found with the specified filters. Try adjusting your settings.');
    }

    return candidates;
}

function findBestMatch(pixelColor, candidates) {
    let bestMatch = null;
    let minDistance = Infinity;

    for (const candidate of candidates) {
        if (pixelColor.a < 128 && !candidate.textureInfo.hasTransparency) {
            continue;
        }

        const distance = colorDistance(pixelColor, candidate.perceivedColor);
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = candidate;
        }
    }

    return bestMatch ? bestMatch.textureInfo : null;
}

async function loadImageBitmap(buffer) {
    const blob = new Blob([buffer]);
    return await createImageBitmap(blob);
}

async function resizeImageBitmap(imageBitmap, width, height) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    return { canvas, ctx };
}

async function getAtlas(atlasFileIndex) {
    const cacheKey = `atlas_${atlasFileIndex}`;
    if (atlasCache[cacheKey]) return atlasCache[cacheKey];

    try {
        const response = await fetch(`/textures/atlas_${atlasFileIndex}.png`);
        if (!response.ok) {
            throw new Error(`Failed to fetch atlas_${atlasFileIndex}.png: ${response.statusText}`);
        }
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        atlasCache[cacheKey] = imageBitmap;
        return imageBitmap;
    } catch (error) {
        console.error(`Error loading atlas ${atlasFileIndex}:`, error);
        throw error;
    }
}

async function getTextureImage(textureInfo, CONFIG) {
    const { atlasFileIndex, textureIndexOnAtlas } = textureInfo;
    const cacheKey = `${atlasFileIndex}-${textureIndexOnAtlas}`;
    if (textureImageCache[cacheKey]) return textureImageCache[cacheKey];

    try {
        const atlas = await getAtlas(atlasFileIndex);
        const texturesPerRow = Math.floor(atlas.width / CONFIG.TEXTURE_SIZE);
        const left = (textureIndexOnAtlas % texturesPerRow) * CONFIG.TEXTURE_SIZE;
        const top = Math.floor(textureIndexOnAtlas / texturesPerRow) * CONFIG.TEXTURE_SIZE;

        const canvas = new OffscreenCanvas(CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(atlas, left, top, CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE, 0, 0, CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE);

        const textureBitmap = await createImageBitmap(canvas);
        textureImageCache[cacheKey] = textureBitmap;
        return textureBitmap;
    } catch (error) {
        console.error(`Error getting texture image for textureId ${textureInfo.textureId}:`, error);
        const canvas = new OffscreenCanvas(CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE);
        return await createImageBitmap(canvas);
    }
}

function generateBlueprintFiles(choicesGrid, texturePalette) {
    const height = choicesGrid.length;
    if (height === 0) return {};
    const width = choicesGrid[0].length;

    const data = new Uint16Array(width * height);
    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const textureId = choicesGrid[y][x];
            let blockId = 0;
            if (textureId !== null && textureId !== undefined) {
                const texture = texturePalette.find(t => t.textureId === textureId);
                if (texture && texture.blockIds && texture.blockIds.length > 0) {
                    blockId = texture.blockIds[0];
                }
            }
            data[i++] = blockId;
        }
    }

    const config = { width, height };
    return {
        blueprintData: data,
        blueprintConfig: JSON.stringify(config, null, 2),
    };
}

export async function runBloxelizer(inputFile, CONFIG, onProgress) {
    try {
        console.log('Starting bloxelization with config:', CONFIG);

        clearCaches();

        let textureData;
        try {
            const response = await fetch('/1_texture_index.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch texture data: ${response.statusText}`);
            }
            textureData = await response.json();
            console.log('Texture data loaded successfully. Total textures:', textureData.texture_palette?.length);
        } catch (error) {
            console.error('Error loading texture data:', error);
            throw new Error('Failed to load texture data. Please make sure the texture files are in the public folder.');
        }

        if (!textureData.texture_palette || !Array.isArray(textureData.texture_palette)) {
            throw new Error('Invalid texture data structure: missing texture_palette array');
        }

        if (!textureData.face_index) {
            console.warn('Texture data missing face_index. Creating default face index.');
            textureData.face_index = {
                front: {},
                top: {}
            };
            textureData.texture_palette.forEach(texture => {
                if (!textureData.face_index.front[texture.textureId]) {
                    textureData.face_index.front[texture.textureId] = [texture.textureId];
                }
                if (!textureData.face_index.top[texture.textureId]) {
                    textureData.face_index.top[texture.textureId] = [texture.textureId];
                }
            });
        }

        const candidates = await loadAndPrepareCandidates(textureData, CONFIG);

        const sourceImageBitmap = await loadImageBitmap(inputFile);
        console.log(`Source image loaded: ${sourceImageBitmap.width}x${sourceImageBitmap.height}`);

        let { outputWidth, outputHeight } = CONFIG;

        if (!outputWidth && !outputHeight) {
            outputWidth = sourceImageBitmap.width;
            outputHeight = sourceImageBitmap.height;
        } else if (outputWidth && !outputHeight) {
            outputHeight = Math.round(sourceImageBitmap.height * (outputWidth / sourceImageBitmap.width));
        } else if (outputHeight && !outputWidth) {
            outputWidth = Math.round(sourceImageBitmap.width * (outputHeight / sourceImageBitmap.height));
        }

        console.log(`Output dimensions: ${outputWidth}x${outputHeight} blocks`);

        const { canvas: resizedCanvas, ctx: resizedCtx } = await resizeImageBitmap(
            sourceImageBitmap,
            outputWidth,
            outputHeight
        );

        const resizedImageData = resizedCtx.getImageData(0, 0, outputWidth, outputHeight);
        const resizedPixels = resizedImageData.data;

        const finalCanvas = new OffscreenCanvas(outputWidth * CONFIG.TEXTURE_SIZE, outputHeight * CONFIG.TEXTURE_SIZE);
        const finalCtx = finalCanvas.getContext('2d');

        const choicesGrid = Array(outputHeight).fill().map(() => Array(outputWidth).fill(null));

        for (let y = 0; y < outputHeight; y++) {
            for (let x = 0; x < outputWidth; x++) {
                const pixelIndex = (y * outputWidth + x) * 4;
                const pixelColor = {
                    r: resizedPixels[pixelIndex],
                    g: resizedPixels[pixelIndex + 1],
                    b: resizedPixels[pixelIndex + 2],
                    a: resizedPixels[pixelIndex + 3]
                };

                if (!CONFIG.allowTransparency && pixelColor.a < 128) {
                    choicesGrid[y][x] = null;
                    continue;
                }

                const bestTextureInfo = findBestMatch(pixelColor, candidates);

                if (bestTextureInfo) {
                    choicesGrid[y][x] = bestTextureInfo.textureId;
                    const textureBitmap = await getTextureImage(bestTextureInfo, CONFIG);
                    finalCtx.drawImage(textureBitmap, x * CONFIG.TEXTURE_SIZE, y * CONFIG.TEXTURE_SIZE);
                } else {
                    finalCtx.fillStyle = `rgba(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b}, ${pixelColor.a / 255})`;
                    finalCtx.fillRect(x * CONFIG.TEXTURE_SIZE, y * CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE, CONFIG.TEXTURE_SIZE);
                    choicesGrid[y][x] = null;
                }
            }

            if (onProgress && y % Math.max(1, Math.floor(outputHeight / 100)) === 0) {
                onProgress(Math.round(((y + 1) / outputHeight) * 100));
            }
        }

        if (onProgress) onProgress(100);

        const blueprintData = generateBlueprintFiles(choicesGrid, textureData.texture_palette);

        const finalBlob = await finalCanvas.convertToBlob({ type: 'image/png' });
        const finalImageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(finalBlob);
        });

        console.log('Bloxelization completed successfully');
        return {
            image: finalImageBase64,
            ...blueprintData
        };

    } catch (error) {
        console.error('An error occurred in the bloxelizer:', error);
        throw error;
    }
}