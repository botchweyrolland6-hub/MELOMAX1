import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:brengforlife123@db.qvogydeqpptymdzizwbz.supabase.co:5432/postgres';

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL database...');
  try {
    await client.connect();
    console.log('Connected successfully!');

    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
    console.log('Executing schema.sql on Supabase PostgreSQL...');

    await client.query(schemaSql);
    console.log('Schema migration executed successfully!');

    // Now seed the 170 tyres directly into tyres table!
    const { INITIAL_TYRES, INITIAL_CATEGORIES } = await import('./src/data/seedData.ts');

    console.log('Seeding 170 tyres into Supabase PostgreSQL...');

    // First get category mapping
    const catRes = await client.query('SELECT id, name FROM public.categories');
    const catMap = {};
    catRes.rows.forEach(row => {
      catMap[row.name] = row.id;
    });

    for (const tyre of INITIAL_TYRES) {
      const catId = catMap[tyre.category_name] || null;
      await client.query(
        `INSERT INTO public.tyres (name, brand, model, size, category_id, price, stock_quantity, description, image_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          tyre.name,
          tyre.brand,
          tyre.model,
          tyre.size,
          catId,
          tyre.price,
          tyre.stock_quantity,
          tyre.description,
          tyre.image_url,
          tyre.status
        ]
      );
    }

    console.log('Successfully seeded all 170 tyres into Supabase PostgreSQL database!');

  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
