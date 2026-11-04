/* build.js — รวมไฟล์ที่แก้ใน CMS เข้าเป็นข้อมูลที่หน้าเว็บอ่าน
   Netlify รันไฟล์นี้อัตโนมัติทุกครั้งที่มีการ Publish (ดู netlify.toml)
   อ่าน: articles/*.json, data/stories.json, data/pages/*.json
   เขียน: data/data.js และ data/articles.json */
const fs = require('fs');
const path = require('path');
const root = __dirname;

function readJSON(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
  catch (e) { return null; }
}

/* 1) เริ่มจาก data.js เดิม (กันข้อมูลส่วนอื่นหาย) */
let base = {};
try {
  const t = fs.readFileSync(path.join(root, 'data/data.js'), 'utf8');
  const m = t.match(/window\.SITE_DATA\s*=\s*([\s\S]*?);?\s*$/);
  if (m) base = JSON.parse(m[1]);
} catch (e) { console.warn('[build] อ่าน data/data.js เดิมไม่ได้ จะสร้างใหม่:', e.message); }
base.articles = base.articles || [];
base.stories = base.stories || [];
base.pages = base.pages || {};

/* 2) บทความ: อ่านทุกไฟล์ใน articles/ (ชื่อไฟล์ = id ของบทความ) */
const dir = path.join(root, 'articles');
if (fs.existsSync(dir)) {
  const list = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (a.draft === true) continue; // ฉบับร่างไม่แสดงบนเว็บ
      list.push({
        id: f.slice(0, -5),
        title: String(a.title || ''),
        image: a.image || '',
        excerpt: a.excerpt || '',
        body: a.body || '',
        date: a.date ? String(a.date) : '',
        featured: a.featured === true,
        order: typeof a.order === 'number' ? a.order : null
      });
    } catch (e) { console.warn('[build] ข้ามไฟล์ที่อ่านไม่ได้:', f, e.message); }
  }
  /* เรียง: มีวันที่ -> ใหม่ก่อน / ไม่มีวันที่ -> ตามเลขลำดับ (น้อยก่อน) */
  list.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (!!a.date !== !!b.date) return a.date ? -1 : 1;
    const oa = a.order == null ? 1e9 : a.order;
    const ob = b.order == null ? 1e9 : b.order;
    return (oa - ob) || a.id.localeCompare(b.id);
  });
  base.articles = list.map(({ order, ...rest }) => rest);
}

/* 3) เรื่องสั้นและหนังสือ + หน้าเว็บ (ถ้ามีไฟล์จาก CMS ให้ใช้ไฟล์นั้น) */
const st = readJSON('data/stories.json');
if (st && Array.isArray(st.items)) base.stories = st.items;
for (const n of ['settings', 'home', 'about', 'contact', 'media']) {
  const p = readJSON('data/pages/' + n + '.json');
  if (p) base.pages[n] = p;
}

/* 4) เขียนผลลัพธ์ */
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/data.js'), 'window.SITE_DATA=' + JSON.stringify(base) + ';\n');
fs.writeFileSync(path.join(root, 'data/articles.json'), JSON.stringify({ items: base.articles }, null, 1));
console.log('[build] บทความ ' + base.articles.length + ' ชิ้น, เรื่องสั้น/หนังสือ ' + base.stories.length + ' เล่ม');
