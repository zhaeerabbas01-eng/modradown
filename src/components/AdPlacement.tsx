import React, { useEffect, useRef } from "react";

interface AdPlacementProps {
  type: "banner" | "sidebar" | "in-content" | "horizontal" | "native" | "direct" | "article" | "article-smartlink" | "side-script";
  title?: string;
  id?: string;
}

export const REVOLTHEM_DIRECT_ADS = [
  "https://revolthem.com/jwqsr68097?key=e95fc4b1b29319cfbc0fd62f65bc1e1c",
  "https://revolthem.com/srzny229h0?key=174ba77b24f608e74b0509c1e5778661"
];

export const ARTICLE_SMART_LINKS = [
  "https://revolthem.com/rru6cbtpj?key=dd276903cd584428c0b83751d8e6e978",
  "https://revolthem.com/xvgp9di7x?key=f810694cdcc8fbd387ada5a2764b2ee2"
];

export default function AdPlacement({ type, title = "Advertisement", id }: AdPlacementProps) {
  let adKey = '';
  let adWidth = 0;
  let adHeight = 0;
  let isNative = false;
  let isDirect = type === 'direct';
  let isArticleSmartLink = type === 'article-smartlink';
  let isSideScript = type === 'side-script';

  if (type === 'article') {
    adKey = '7276cc692cc5097d15f4bc03999a0435';
    adWidth = 468;
    adHeight = 60;
  } else if (type === 'banner') {
    adKey = 'b616b8815f5c3778f5baa096dc0ba93a';
    adWidth = 300;
    adHeight = 250;
  } else if (type === 'horizontal') {
    adKey = '8622e6d8a31018dacf30c0f071176034';
    adWidth = 728;
    adHeight = 90;
  } else if (type === 'sidebar') {
    adKey = '31619df1fbc9003466c9d256e5437b69';
    adWidth = 160;
    adHeight = 600;
  } else if (type === 'in-content') {
    adKey = '7276cc692cc5097d15f4bc03999a0435';
    adWidth = 468;
    adHeight = 60;
  } else if (type === 'native') {
    isNative = true;
  } else if (type === 'article-smartlink') {
    isArticleSmartLink = true;
  } else if (type === 'side-script') {
    isSideScript = true;
  } else {
    isDirect = true;
  }

  const iframeSrcDoc = isSideScript
    ? `
      <!DOCTYPE html>
      <html>
        <head><style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; }</style></head>
        <body>
          <script src="https://revolthem.com/36/98/b9/3698b99f3718b75208f1d258bb207c1d.js"></script>
        </body>
      </html>
    `
    : isNative 
    ? `
      <!DOCTYPE html>
      <html>
        <head><style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; }</style></head>
        <body>
          <script async="async" data-cfasync="false" src="https://revolthem.com/d3098233880d1789bdbb03aaa7855c9f/invoke.js"></script>
          <div id="container-d3098233880d1789bdbb03aaa7855c9f"></div>
        </body>
      </html>
    `
    : `
      <!DOCTYPE html>
      <html>
        <head><style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; }</style></head>
        <body>
          <script>
            atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${adHeight},
              'width' : ${adWidth},
              'params' : {}
            };
          </script>
          <script src="https://revolthem.com/${adKey}/invoke.js"></script>
        </body>
      </html>
    `;

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden my-4">
      <div className="flex justify-center items-center max-w-full overflow-hidden w-full">
        {isArticleSmartLink ? (
          <div className="w-full bg-gradient-to-r from-purple-900/50 via-brand-primary/30 to-blue-900/50 border border-brand-primary/40 p-4 md:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-md border border-amber-400/30 inline-block mb-1">
                🔥 Sponsored Top Offer
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-white">Recommended High Speed Resources</h4>
              <p className="text-xs text-gray-300">Click below to unlock fast download links and premium content mirrors</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
              <a 
                href={ARTICLE_SMART_LINKS[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-4 py-3 rounded-xl transition shadow-lg text-center flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Smart Link Ad 1</span>
              </a>
              <a 
                href={ARTICLE_SMART_LINKS[1]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-3 rounded-xl transition shadow-lg text-center flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Smart Link Ad 2</span>
              </a>
            </div>
          </div>
        ) : isDirect ? (
          <div className="w-full max-w-2xl bg-gradient-to-r from-purple-900/40 via-brand-primary/20 to-blue-900/40 border border-brand-primary/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md border border-brand-primary/20">
                Sponsored Offer
              </span>
              <h4 className="text-sm font-bold text-white mt-1">High-Speed Download Servers</h4>
              <p className="text-xs text-gray-400">Sponsored high speed mirror links for instant downloads</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a 
                href={REVOLTHEM_DIRECT_ADS[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <span>Direct Link 1</span>
              </a>
              <a 
                href={REVOLTHEM_DIRECT_ADS[1]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <span>Direct Link 2</span>
              </a>
            </div>
          </div>
        ) : isSideScript || isNative ? (
           <iframe 
             srcDoc={iframeSrcDoc} 
             style={{ width: '100%', height: '300px', border: 'none', overflow: 'hidden' }}
             scrolling="no"
           />
        ) : (
           <iframe 
             srcDoc={iframeSrcDoc} 
             width={adWidth} 
             height={adHeight} 
             style={{ border: 'none', overflow: 'hidden', display: 'block', maxWidth: '100%' }}
             scrolling="no"
           />
        )}
      </div>
    </div>
  );
}
