"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/20240324_update_column_names.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        const { error } = await supabase.rpc('exec_sql', {
            query: migrationSQL
        });
        if (error) {
            console.error('Error running migration:', error);
            process.exit(1);
        }
        console.log('Migration completed successfully');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
runMigration();
//# sourceMappingURL=run-migration.js.map