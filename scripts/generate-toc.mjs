import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_MODULES_PATH = 'content/modules';
const OUTPUT_FILENAME = 'content-index.json';

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function main() {
  try {
    const files = await readdir(CONTENT_MODULES_PATH);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const modules = await Promise.all(jsonFiles.map(async (file) => {
      const filePath = path.join(CONTENT_MODULES_PATH, file);
      const content = JSON.parse(await readFile(filePath, 'utf8'));
      const slug = file.replace(/\.json$/i, '');
      
      return {
        id: content.id || slug,
        slug: slug,
        title: normalizeString(content.title) || slug,
        description: normalizeString(content.description) || '',
        lessonCount: Array.isArray(content.lessons) ? content.lessons.length : 0,
        image: content.image || null,
        path: filePath.replace(/\\/g, '/') // Ensure forward slashes
      };
    }));

    const toc = {
      generatedAt: new Date().toISOString(),
      total: modules.length,
      modules: modules.sort((a, b) => a.slug.localeCompare(b.slug))
    };

    await writeFile(OUTPUT_FILENAME, JSON.stringify(toc, null, 2) + '\n', 'utf8');
    console.log(`Successfully generated ${OUTPUT_FILENAME} with ${modules.length} modules.`);
  } catch (error) {
    console.error('Error generating TOC:', error);
    process.exit(1);
  }
}

main();
