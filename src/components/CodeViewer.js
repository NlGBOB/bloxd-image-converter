import React from 'react';
import CodeSnippet from './CodeSnippet';
import { SETUP_CODE } from '../constants';

const CodeViewer = ({ blueprint, config }) => {
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
                const code = `let s=[${chunkStr}],w=${width},h=${height},o=${currentOffset},[x,y,z]=thisPos;(f=_=>{let c=128,i;do{if(_>=s.length)return;i=o+_;api.setBlock(${coordLogic},B[s[_]]);_++}while(--c);S.run(()=>f(_),1,'b'+o)})(0)`;

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

    return (
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
    );
};

export default CodeViewer;