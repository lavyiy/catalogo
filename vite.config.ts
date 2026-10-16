import { ViteEnv } from './types';

export default ({ mode }: { mode: string }): ViteEnv => {
  const isSSSROutput = mode === 'ssr' || mode === 'experimental-server';
  return {
    plugins: [],
    server: {
      port: 3000,
      open: true,
      strictPort: false,
    },
    preview: {
      port: 4000,
      open: false,
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: (rollupConfig) => {
        rollupConfig.output!.preserveModules = true;
        rollupConfig.output!.preserveModulesAlias(['inter']);
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    esbuild: {
      drop: mode !== 'production' ? ['console', 'debugger'] : [],
    },
    ssr: isSSSROutput,
  };
};