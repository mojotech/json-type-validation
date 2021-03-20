import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: 'index',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: id => {
    return id.includes('/node_modules/');
  },
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true
    }),
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
};
