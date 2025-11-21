import React from 'react';
import CodeSnippet from './CodeSnippet';
import { SETUP_CODE, BLOCK_IDS, CHARSET } from '../constants';

const CodeViewer = ({ blueprint, config }) => {
    const getDynamicCode = () => {
        if (!blueprint) return [];
        const { width, height } = JSON.parse(blueprint.config);
        let coordLogic = "";

        switch (config.buildOrientation) {
            case "wall_north":
                coordLogic = "x-(I%w),y+h-((I/w)|0),z";
                break;
            case "wall_south":
                coordLogic = "x+(I%w),y+h-((I/w)|0),z";
                break;
            case "wall_east":
                coordLogic = "x,y+h-((I/w)|0),z-(I%w)";
                break;
            case "wall_west":
                coordLogic = "x,y+h-((I/w)|0),z+(I%w)";
                break;
            case "floor_north":
                coordLogic = "x-(I%w),y+1,z-(h-1-((I/w)|0))";
                break;
            case "floor_south":
                coordLogic = "x+(I%w),y+1,z+(h-1-((I/w)|0))";
                break;
            case "floor_east":
                coordLogic = "x+(h-1-((I/w)|0)),y+1,z-(I%w)";
                break;
            case "floor_west":
                coordLogic = "x-(h-1-((I/w)|0)),y+1,z+(I%w)";
                break;
            case "ceiling_north":
                coordLogic = "x+(I%w),y+1,z-(h-1-((I/w)|0))";
                break;
            case "ceiling_south":
                coordLogic = "x-(I%w),y+1,z+(h-1-((I/w)|0))";
                break;
            case "ceiling_east":
                coordLogic = "x+(h-1-((I/w)|0)),y+1,z+(I%w)";
                break;
            case "ceiling_west":
                coordLogic = "x-(h-1-((I/w)|0)),y+1,z-(I%w)";
                break;
            default:
                coordLogic = "x-(I%w),y+h-((I/w)|0),z";
        }

        const encodedData = [];
        for (let i = 0; i < blueprint.data.length; i++) {
            const id = blueprint.data[i];
            const index = BLOCK_IDS.indexOf(id);

            if (index === -1) {
                encodedData.push(CHARSET[0].repeat(2)); // Air/Unknown
            } else {
                const char1 = CHARSET[Math.floor(index / 27)];
                const char2 = CHARSET[index % 27];
                encodedData.push(char1 + char2);
            }
        }
        const fullString = encodedData.join('');
        const getCodeTemplate = (dataStr, w, h, offset, logic) => {
            return `let s="${dataStr}",w=${w},h=${h},o=${offset},[x,y,z]=thisPos;S.run(function f(i){i=-~i-1;let c=256;do{if(i*2>=s.length)return;let I=o+i,k=s[i*2]+s[i*2+1];api.setBlock(${logic},B[k]);i++}while(--c>0);S.run(()=>f(i),1,'b'+o)},0,'b'+o)`;
        };

        const MAX_TOTAL_CHARS = 15900;
        const parts = [];
        let currentBlockIndex = 0;
        const totalBlocks = fullString.length / 2;

        while (currentBlockIndex < totalBlocks) {
            const emptyTemplate = getCodeTemplate("", width, height, currentBlockIndex, coordLogic);
            const overhead = emptyTemplate.length;

            const availableChars = MAX_TOTAL_CHARS - overhead;
            const blocksToTake = Math.floor(availableChars / 2);
            const chunkData = fullString.substr(currentBlockIndex * 2, blocksToTake * 2);
            const code = getCodeTemplate(chunkData, width, height, currentBlockIndex, coordLogic);

            parts.push({
                label: `2.${parts.length + 1} Build Part ${parts.length + 1}${currentBlockIndex + blocksToTake >= totalBlocks ? ' (Final)' : ''}`,
                code: code
            });

            currentBlockIndex += blocksToTake;
        }

        return parts;
    };

    return (
        <div className="code-section">
            <div className="code-section-header">
                <h3>Game Code</h3>
                <p>Copy these snippets into the SAME code block, and run the codes one by one to build the image.</p>
            </div>

            <CodeSnippet
                label="1. One-Time Setup (Replace your world code with this)"
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