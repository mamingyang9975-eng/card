import { cp, mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptsDirectory, '..');
const distDirectory = resolve(projectDirectory, 'dist');
const clientDirectory = resolve(distDirectory, 'client');
const serverDirectory = resolve(distDirectory, 'server');

await rm(clientDirectory, { recursive: true, force: true });
await rm(serverDirectory, { recursive: true, force: true });
await mkdir(clientDirectory, { recursive: true });

const buildEntries = await readdir(distDirectory, { withFileTypes: true });

for (const entry of buildEntries) {
  if (entry.name === '.openai' || entry.name === 'client' || entry.name === 'server') continue;

  await rename(
    resolve(distDirectory, entry.name),
    resolve(clientDirectory, entry.name),
  );
}

await mkdir(serverDirectory, { recursive: true });
await cp(
  resolve(projectDirectory, 'sites', 'server', 'index.js'),
  resolve(serverDirectory, 'index.js'),
);
