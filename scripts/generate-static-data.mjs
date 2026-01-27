import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const WIKI_DATA_DIR = join(ROOT_DIR, 'data', 'raw', 'wiki');
const COMPARISONS_DIR = join(ROOT_DIR, 'data', 'interim', 'comparisons');
const OUTPUT_DIR = join(ROOT_DIR, 'src', 'data');

async function loadArticles(baselineFilenames) {
  const files = await readdir(WIKI_DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const articles = [];

  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(WIKI_DATA_DIR, file), 'utf-8');
      const json = JSON.parse(content);

      // Clean up page_title (trim whitespace)
      json.page_title = json.page_title.trim();

      articles.push({
        ...json,
        filename: file,
        is_baseline: baselineFilenames.has(file.toLowerCase()),
      });
    } catch (error) {
      console.warn(`Failed to load ${file}:`, error.message);
    }
  }

  return articles;
}

async function loadComparisons() {
  try {
    const files = await readdir(COMPARISONS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const comparisons = [];

    for (const file of jsonFiles) {
      try {
        const content = await readFile(join(COMPARISONS_DIR, file), 'utf-8');
        const json = JSON.parse(content);

        const name = file
          .replace(/\.json$/i, '')
          .replace(/_/g, ' ')
          .replace(/ vs /gi, ' vs ');

        comparisons.push({
          id: file.replace(/\.json$/i, ''),
          name,
          primary_page: json.primary_page,
          baseline_page: json.baseline_page,
        });
      } catch (error) {
        console.warn(`Failed to load comparison ${file}:`, error.message);
      }
    }

    return comparisons;
  } catch {
    return [];
  }
}

async function main() {
  console.log('Generating static data...');

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Load comparisons first to derive baseline filenames
  const comparisons = await loadComparisons();
  console.log(`Loaded ${comparisons.length} comparisons`);

  const baselineFilenames = new Set(
    comparisons.map((c) => c.baseline_page.toLowerCase())
  );

  // Load articles, marking baselines from comparison data
  const articles = await loadArticles(baselineFilenames);
  console.log(`Loaded ${articles.length} articles`);

  // Write combined data
  const staticData = {
    articles,
    comparisons,
  };

  await writeFile(
    join(OUTPUT_DIR, 'static-data.json'),
    JSON.stringify(staticData, null, 2),
    'utf-8'
  );

  console.log('Static data generated successfully!');
}

main().catch(console.error);
