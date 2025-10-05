import { scrapeSequential } from './scraper.js'
import { config } from "./config.js";
import { pool } from "../db.js";
import { addPosts } from "./queries.js";
import format from 'pg-format';

(async () => {
  const results = await scrapeSequential(config);

  console.log('\n=== Результаты ===');
  for (const r of results) {
    if (!r.ok) {
      console.log(`❌ ${r.url}: ${r.error}`);
      continue;
    }

    const items = r.data.items;

    if (items.length === 0) continue;

    const values = items.map(i => [
      r.idGroup,
      i.text
    ]);

    const query = format(addPosts, values);

    await pool.query(query);
    console.log(`✅ Вставлено ${items.length} постов из ${r.url}`);
  }
})();
