/**
 * Generates large CSV fixtures for the "large file / limits" tests.
 * These files are big, so they are git-ignored and created on demand:
 *
 *   npm run gen:data          # default 50k rows
 *   ROWS=200000 npm run gen:data
 *
 * Adjust ROWS to sit just above your product's documented import limit so the
 * test actually exercises the limit / partial-import path.
 */
import fs from 'node:fs';

const ROWS = Number(process.env.ROWS || 50_000);

function write(path, header, rowFn) {
  const stream = fs.createWriteStream(path);
  stream.write(header + '\n');
  for (let i = 1; i <= ROWS; i++) stream.write(rowFn(i) + '\n');
  stream.end();
  return new Promise((res) => stream.on('finish', res));
}

await Promise.all([
  write(
    'test-data/contacts/large-contacts.csv',
    'Email,First Name,Last Name,Phone',
    (i) => `user${i}@example.com,First${i},Last${i},+1-202-555-${String(i % 10000).padStart(4, '0')}`,
  ),
  write(
    'test-data/companies/large-companies.csv',
    'Company Name,Domain,Industry,Employees',
    (i) => `Company ${i},company${i}.com,Software,${(i % 5000) + 1}`,
  ),
  write(
    'test-data/deals/large-deals.csv',
    'Deal Name,Amount,Stage,Close Date',
    (i) => `Deal ${i},${(i % 100000) + 100},Proposal,2026-12-31`,
  ),
]);

console.log(`Generated large fixtures with ${ROWS.toLocaleString()} rows each.`);
