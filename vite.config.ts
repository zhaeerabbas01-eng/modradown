import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'strip-fetch-assign',
        transform(code, id) {
          let newCode = code;
          let changed = false;
          // Catch any assignment to fetch
          if (/(?:^|[^a-zA-Z0-9_.$])(window|globalThis|global|self|this)\s*\.\s*fetch\s*=/g.test(newCode)) {
            newCode = newCode.replace(/(?:^|[^a-zA-Z0-9_.$])(window|globalThis|global|self|this)\s*\.\s*fetch\s*=/g, '$1.__patchedFetchAssign =');
            changed = true;
          }
          if (/(?:^|[^a-zA-Z0-9_.$])(window|globalThis|global|self|this)\s*\[\s*['"]fetch['"]\s*\]\s*=/g.test(newCode)) {
            newCode = newCode.replace(/(?:^|[^a-zA-Z0-9_.$])(window|globalThis|global|self|this)\s*\[\s*['"]fetch['"]\s*\]\s*=/g, '$1.__patchedFetchAssign =');
            changed = true;
          }
          if (/(?:^|[^a-zA-Z0-9_.$])fetch\s*=/g.test(newCode)) {
            newCode = newCode.replace(/(?:^|[^a-zA-Z0-9_.$])fetch\s*=/g, ' window.__patchedFetchAssign =');
            changed = true;
          }
          if (changed) {
            console.log("Stripping fetch assignment in", id);
            return { code: newCode };
          }
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
