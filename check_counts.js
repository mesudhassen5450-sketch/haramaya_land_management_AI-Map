
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdguhjvkvouvwjboklet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3VoanZrdm91dndqYm9rbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwODMsImV4cCI6MjA4MzI5NTA4M30.D9-c1Cnr2abB57gYoCUkIZS4z_AxtTnnSScbUb6-b10'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCounts() {
    const tables = ['profiles', 'user_roles', 'land_owners', 'land_parcels', 'tax_assessments'];

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error(`Error checking ${table}:`, error.message);
        } else {
            console.log(`${table}: ${count} rows`);
        }
    }
}

checkCounts()
