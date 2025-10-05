import { chromium } from 'playwright';

export async function scrapeSequential(configs, opts = {}) {
  const { minDelay = 1000, maxDelay = 2000 } = opts;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    for (const cfg of configs) {
      const { url, type, idGroup } = cfg;
      console.log(`\n🔍 Парсим (${type}): ${url}`);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        let parsed;
        switch (type) {
          case 'tg':
            parsed = await parseTg(page, cfg);
            break;
          default:
            parsed = await parseGeneric(page, cfg);
            break;
        }

        results.push({ url, type, ok: true, data: parsed, idGroup });
      } catch (err) {
        console.error(`❌ Ошибка на ${url}: ${err.message}`);
        results.push({ url, type, ok: false, error: err.message });
      }

      await delay(randomBetween(minDelay, maxDelay));
    }
  } finally {
    await page.close();
    await browser.close();
  }

  return results;
}

/* =======================
   👇 ПАРСЕР ДЛЯ TELEGRAM
   ======================= */
async function parseTg(page, cfg) {
  const { selectorsToPars = [], idEl, postToIgnore = [] } = cfg;

  const items = [];

  for (const selector of selectorsToPars) {
    const found = await page.$$eval(selector, (nodes, idEl) => {
      return nodes.map(node => {
        const parentMsg = node.closest('.tgme_widget_message');
        const id = parentMsg ? parentMsg.getAttribute('data-post') : null;
        const text = node.innerText.trim();

        return { id, text };
      }).filter(n => n.text.length > 0);
    }, idEl);

    items.push(...found);
  }

  const unique = Array.from(new Map(items.map(i => [i.id, i])).values());

  let filtered = unique;

  if (postToIgnore.length > 0) {
    const regex = new RegExp(postToIgnore.join('|'), 'i'); // создаём общий регэксп
    filtered = unique.filter(i => !regex.test(i.text));
  }

  return { items: filtered };
}


async function parseGeneric(page, cfg) {
  const { selectorsToPars = [], idEl } = cfg;
  const items = [];

  for (const selector of selectorsToPars) {
    const found = await page.$$eval(selector, (nodes, idEl) => {
      return nodes.map(node => {
        let id = null;

        if (idEl) {
          const idNode = node.closest(idEl);
          if (idNode) {
            id =
              idNode.getAttribute('id') ||
              idNode.getAttribute('data-id') ||
              idNode.innerText.slice(0, 30);
          }
        }

        return { id, text: node.innerText.trim() };
      }).filter(n => n.text.length > 0);
    }, idEl);
    items.push(...found);
  }

  const unique = idEl
    ? Array.from(new Map(items.map(i => [i.id, i])).values())
    : items;

  return { items: unique };
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function randomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
