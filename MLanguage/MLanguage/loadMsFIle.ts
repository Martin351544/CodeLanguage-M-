export function loadMsFile(filePath: string): Promise<string> {
  if (!filePath.endsWith('.Ms')) {
    throw new Error('Expected a .Ms file');
  }
  return Deno.readTextFile(filePath);
}