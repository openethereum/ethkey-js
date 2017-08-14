import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  external: ['secp256k1/elliptic','js-sha3'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: 'target/lib.js'
};
