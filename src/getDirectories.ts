import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export default function getDirectories(absPath) {
  return readdirSync(absPath).filter((file) => statSync(join(absPath, file)).isDirectory());
}
