import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);
const { createServer } = await import('vite');
const server = await createServer({ server: { port: 5173 } });
await server.listen();
server.printUrls();
