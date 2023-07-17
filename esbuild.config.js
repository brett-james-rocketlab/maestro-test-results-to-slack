const { build } = require('esbuild');

build({
  entryPoints: ['./src/index.ts'], // Specify the entry point(s) of your TypeScript application
  outdir: './dist', // Specify the output directory for the built files
  platform: 'node',
  bundle: true,
  minify: true,
  sourcemap: true,
//   define: {
//     'process.env.NODE_ENV': '"production"', // Define any environment variables you require
//   },
  loader: {
    '.ts': 'ts', // Use the 'ts' loader for TypeScript files
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
