/**
 * One config object per entity keeps the three spec files nearly identical
 * and data-driven. Add/adjust fields, mappings and file paths here.
 */
export interface EntityConfig {
  name: 'contacts' | 'companies' | 'deals';
  listPath: string;
  /** column header -> app field label used by the mapping step */
  validMapping: Record<string, string>;
  files: {
    valid: string;
    invalid: string;        // wrong headers / bad data types
    missingRequired: string; // required field blank
    duplicate: string;      // duplicate rows / existing records
    wrongType: string;      // non-CSV, e.g. .txt or .pdf
    large: string;          // over the row/size limit
  };
}

const dir = (e: string, f: string) => `test-data/${e}/${f}`;

export const CONTACTS: EntityConfig = {
  name: 'contacts',
  listPath: process.env.CONTACTS_IMPORT_PATH || '/crm/contacts',
  validMapping: {
    'Email': 'Email',
    'First Name': 'First Name',
    'Last Name': 'Last Name',
    'Phone': 'Phone',
  },
  files: {
    valid: dir('contacts', 'valid.csv'),
    invalid: dir('contacts', 'invalid-headers.csv'),
    missingRequired: dir('contacts', 'missing-email.csv'),
    duplicate: dir('contacts', 'duplicates.csv'),
    wrongType: dir('contacts', 'not-a-csv.txt'),
    large: dir('contacts', 'large-contacts.csv'),
  },
};

export const COMPANIES: EntityConfig = {
  name: 'companies',
  listPath: process.env.COMPANIES_IMPORT_PATH || '/crm/companies',
  validMapping: {
    'Company Name': 'Company Name',
    'Domain': 'Website',
    'Industry': 'Industry',
    'Employees': 'Employee Count',
  },
  files: {
    valid: dir('companies', 'valid.csv'),
    invalid: dir('companies', 'invalid-headers.csv'),
    missingRequired: dir('companies', 'missing-name.csv'),
    duplicate: dir('companies', 'duplicates.csv'),
    wrongType: dir('companies', 'not-a-csv.txt'),
    large: dir('companies', 'large-companies.csv'),
  },
};

export const DEALS: EntityConfig = {
  name: 'deals',
  listPath: process.env.DEALS_IMPORT_PATH || '/crm/deals',
  validMapping: {
    'Deal Name': 'Deal Name',
    'Amount': 'Amount',
    'Stage': 'Stage',
    'Close Date': 'Close Date',
  },
  files: {
    valid: dir('deals', 'valid.csv'),
    invalid: dir('deals', 'invalid-amount.csv'),
    missingRequired: dir('deals', 'missing-name.csv'),
    duplicate: dir('deals', 'duplicates.csv'),
    wrongType: dir('deals', 'not-a-csv.txt'),
    large: dir('deals', 'large-deals.csv'),
  },
};
