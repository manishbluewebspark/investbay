// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import { terser } from 'rollup-plugin-terser'


// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),

//     {
//       ...terser({
//         compress: true,
//         mangle: true,         
//         format: { comments: false } 
//       }),
//       apply: 'build',
//     },
//   ],
//   build: {
//     sourcemap: false,      
//     minify: 'terser',    
//     rollupOptions: {
//       output: {
//         manualChunks: undefined, 
//       },
//     },
//   },
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
