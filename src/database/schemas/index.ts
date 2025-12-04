// Dynamic schema loader - automatically imports all *.schema.ts files
// Convention: All schema files must be named *.schema.ts and located in **/schemas/*.schema.ts
//
// How it works:
// 1. At runtime, scans src/ directory for all *.schema.ts files
// 2. Dynamically imports them and merges all exports
// 3. Explicit exports below provide TypeScript type support
// 4. New schemas are automatically discovered - just create the file!

import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively finds all *.schema.ts files and returns their absolute file paths
 */
function findSchemaFiles(): string[] {
  const schemaFiles: string[] = [];
  const srcDir = path.join(__dirname, '../../');
  const schemaPattern = /\.schema\.ts$/;

  function scanDirectory(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip node_modules, dist, and other build directories
        if (
          entry.isDirectory() &&
          (entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === '.git' ||
            entry.name.startsWith('.'))
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && schemaPattern.test(entry.name)) {
          schemaFiles.push(fullPath);
        }
      }
    } catch {
      // Directory might not exist or be inaccessible - ignore
    }
  }

  scanDirectory(srcDir);
  return schemaFiles;
}

/**
 * Dynamically loads all schema modules and merges their exports
 * This works at runtime
 */
function loadAllSchemas(): Record<string, any> {
  const allSchemas: Record<string, any> = {};
  const schemaFiles = findSchemaFiles();

  for (const filePath of schemaFiles) {
    try {
      // Use require for dynamic loading (works at runtime)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const schemaModule = require(filePath);
      Object.assign(allSchemas, schemaModule);
    } catch (error) {
      console.warn(`Failed to load schema from ${filePath}:`, error);
    }
  }

  return allSchemas;
}

// Auto-discover and load all schemas at module initialization
const discoveredSchemas = loadAllSchemas();

// Export all discovered schemas dynamically
// This ensures all schemas are available even if not explicitly exported below
Object.keys(discoveredSchemas).forEach(key => {
  if (!(key in exports)) {
    (exports as any)[key] = discoveredSchemas[key];
  }
});

// Explicit exports for TypeScript type support and IDE autocomplete
// These are also auto-discovered above, but explicit exports help with:
// - TypeScript type checking
// - IDE autocomplete and navigation
// - Better developer experience
export * from '../../auth/schemas/auth.schema';
export * from '../../trains/schemas/train.schema';
export * from '../../trains/schemas/train-translations.schema';

// Note: When you create a new schema file (e.g., src/users/schemas/user.schema.ts),
// it will be automatically discovered and included. You can optionally add an explicit
// export here for better TypeScript support, but it's not required for runtime.
