
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdguhjvkvouvwjboklet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3VoanZrdm91dndqYm9rbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwODMsImV4cCI6MjA4MzI5NTA4M30.D9-c1Cnr2abB57gYoCUkIZS4z_AxtTnnSScbUb6-b10'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedData() {
    console.log('Logging in...')
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'itechnology416@gmail.com',
        password: '688587@#$%'
    })

    if (loginError) {
        console.error('Login failed:', loginError.message)
        return
    }

    const userId = session.user.id
    console.log('Logged in as:', userId)

    // 1. Ensure Profile & Role
    console.log('Checking Profile...')
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) {
        console.log('Creating Profile...')
        await supabase.from('profiles').insert({ id: userId, full_name: 'Admin User', email: 'itechnology416@gmail.com' });
    }

    console.log('Checking Role...')
    const { data: role } = await supabase.from('user_roles').select('*').eq('user_id', userId).eq('role', 'admin').maybeSingle();
    if (!role) {
        console.log('Assigning Admin Role...')
        await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
    }

    // 2. Create Land Owners
    console.log('Seeding Land Owners...')
    const ownersData = [
        { full_name: 'Abebe Kebede', phone: '0911001122', email: 'abebe@example.com', address: 'Haramaya Kebele 01', national_id: 'ID-001' },
        { full_name: 'Chala Tadesse', phone: '0922003344', email: 'chala@example.com', address: 'Haramaya Kebele 02', national_id: 'ID-002' },
        { full_name: 'Fatuma Mohammed', phone: '0933005566', email: 'fatuma@example.com', address: 'Haramaya Kebele 03', national_id: 'ID-003' }
    ];

    const { data: owners, error: ownersError } = await supabase.from('land_owners').upsert(ownersData, { onConflict: 'national_id' }).select();
    if (ownersError) {
        console.error('Owners error:', ownersError);
        return;
    }

    // 3. Create Land Parcels
    console.log('Seeding Land Parcels...')
    const parcelsData = [
        { parcel_id: 'HP-2025-001', owner_id: owners[0].id, land_use: 'residential', area_sqm: 450, zone: 'Zone A', kebele: '01', status: 'registered' },
        { parcel_id: 'HP-2025-002', owner_id: owners[1].id, land_use: 'commercial', area_sqm: 1200, zone: 'Zone B', kebele: '02', status: 'registered' },
        { parcel_id: 'HP-2025-003', owner_id: owners[2].id, land_use: 'agricultural', area_sqm: 5000, zone: 'Zone C', kebele: '03', status: 'pending' },
        { parcel_id: 'HP-2025-004', owner_id: owners[0].id, land_use: 'residential', area_sqm: 300, zone: 'Zone A', kebele: '01', status: 'registered' }
    ];

    const { data: parcels, error: parcelsError } = await supabase.from('land_parcels').upsert(parcelsData, { onConflict: 'parcel_id' }).select();
    if (parcelsError) {
        console.error('Parcels error:', parcelsError);
        return;
    }

    // 4. Create Tax Assessments
    console.log('Seeding Tax Assessments...')
    const taxData = parcels.map((p, i) => ({
        tax_id: `TAX-2025-${p.parcel_id}`,
        parcel_id: p.id,
        fiscal_year: 2025,
        assessed_value: p.area_sqm * 1000,
        tax_rate: 0.05,
        tax_amount: p.area_sqm * 50,
        total_due: p.area_sqm * 50,
        due_date: '2025-12-31',
        status: i % 2 === 0 ? 'paid' : 'pending'
    }));

    await supabase.from('tax_assessments').upsert(taxData, { onConflict: 'tax_id' });

    // 5. Create Payments for paid taxes
    console.log('Seeding Payments...')
    const { data: paidTaxes } = await supabase.from('tax_assessments').select('*').eq('status', 'paid');
    if (paidTaxes) {
        const paymentsData = paidTaxes.map(t => ({
            receipt_number: `REC-${t.tax_id}`,
            tax_assessment_id: t.id,
            amount: t.total_due,
            payment_method: 'cash',
            payment_date: new Date().toISOString()
        }));
        await supabase.from('payments').upsert(paymentsData, { onConflict: 'receipt_number' });
    }

    console.log('Seed complete!');
}

seedData();
