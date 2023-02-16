import path from "path";
import { fileURLToPath } from "url";
/**
 * 获取webpack的绝对路径
 * @returns 
 */
export function getEjsDirname() {
  return path.dirname(fileURLToPath(import.meta.url));
}
