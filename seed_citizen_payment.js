
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

    // 1. Check/Create Land Owner
    console.log('Checking Land Owner...')
    let { data: owner } = await supabase
        .from('land_owners')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (!owner) {
        console.log('Creating Land Owner...')
        const { data: newOwner, error: ownerError } = await supabase
            .from('land_owners')
            .insert({
                user_id: userId,
                full_name: 'Admin User',
                phone: '0911223344',
                email: 'itechnology416@gmail.com',
                address: 'Haramaya, Zone 01'
            })
            .select()
            .single()

        if (ownerError) {
            console.error('Failed to create owner:', ownerError)
            return
        }
        owner = newOwner
    }
    console.log('Land Owner ID:', owner.id)

    // 2. Check/Create Land Parcel
    console.log('Checking Land Parcel...')
    let { data: parcel } = await supabase
        .from('land_parcels')
        .select('*')
        .eq('owner_id', owner.id)
        .single() // Just get one

    if (!parcel) {
        console.log('Creating Land Parcel...')
        const { data: newParcel, error: parcelError } = await supabase
            .from('land_parcels')
            .insert({
                owner_id: owner.id,
                parcel_id: `HP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                area_sqm: 500,
                location: 'Kebele 01, House 123',
                land_use: 'residential',
                status: 'registered'
            })
            .select()
            .single()

        if (parcelError) {
            console.error('Failed to create parcel:', parcelError)
            return
        }
        parcel = newParcel
    }
    console.log('Parcel ID:', parcel.id)

    // 3. Check/Create Pending Tax Assessment
    console.log('Checking Tax Assessments...')
    const { data: existingTax } = await supabase
        .from('tax_assessments')
        .select('*')
        .eq('parcel_id', parcel.id)
        .eq('status', 'pending')
        .maybeSingle()

    if (!existingTax) {
        console.log('Creating Pending Tax Assessment...')
        const { error: taxError } = await supabase
            .from('tax_assessments')
            .insert({
                parcel_id: parcel.id,
                fiscal_year: '2025',
                assessed_value: 100000,
                tax_rate: 0.045,
                tax_amount: 4500.00,
                penalty_amount: 0,
                total_due: 4500.00,
                due_date: '2025-12-31',
                status: 'pending',
                tax_id: `TAX-${Date.now()}`
            })

        if (taxError) {
            console.error('Failed to create tax assessment:', taxError)
            return
        }
        console.log('Created pending tax assessment.')
    } else {
        console.log('Pending tax assessment already exists.')
    }

    console.log('Seed check complete. Please refresh the browser.')
}

seedData()
