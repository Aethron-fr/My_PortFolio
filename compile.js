import fs from 'fs';
import { transformSync } from 'esbuild';

const code = fs.readFileSync('./src/components/ResumeViewer.jsx', 'utf8');

const result = transformSync(code, {
  loader: 'jsx',
  format: 'cjs',
});

fs.writeFileSync('./ResumeViewer.cjs', result.code);
