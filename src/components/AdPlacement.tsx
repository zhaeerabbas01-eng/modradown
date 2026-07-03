import React, { useEffect, useRef } from "react";

interface AdPlacementProps {
  type: "banner" | "sidebar" | "in-content" | "horizontal" | "native" | "direct";
  title?: string;
  id?: string;
}

export default function AdPlacement({ type, title = "Advertisement", id }: AdPlacementProps) {
  let adKey = '';
  let adWidth = 0;
  let adHeight = 0;
  let isNative = false;

  if (type === 'banner') {
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
  } else if (type === 'native' || type === 'in-content') {
    isNative = true;
  } else {
    adKey = '15974782d7d7f8e8d19963fb60a0041f';
    adWidth = 320;
    adHeight = 50;
  }

  const iframeSrcDoc = isNative 
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
    <div className="w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="flex justify-center items-center max-w-full overflow-hidden min-h-[50px]">
        {isNative ? (
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
