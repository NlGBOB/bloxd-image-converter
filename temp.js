const getCodeTemplate = (dataStr, w, h, offset, logic) => {
    return `let s="${dataStr}",w=${w},h=${h},o=${offset},[x,y,z]=thisPos;S.run(function f(i=0){let c=20;do{if(i*2>=s.length)return;let I=o+i,k=s[i*2]+s[i*2+1];api.setBlock(${logic},B[k]);i++}while(--c>0);S.run(()=>f(i),1,'b'+o)},0,'b'+o)`;
};