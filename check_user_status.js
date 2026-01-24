
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdguhjvkvouvwjboklet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3VoanZrdm91dndqYm9rbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwODMsImV4cCI6MjA4MzI5NTA4M30.D9-c1Cnr2abB57gYoCUkIZS4z_AxtTnnSScbUb6-b10'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUser() {
    console.log('Logging in...')

    const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: 'itechnology416@gmail.com',
        password: '688587@#$%'
    })

    if (error) {
        console.error('Login failed:', error.message)
        return
    }

    console.log('Login successful!')
    console.log('User ID:', session.user.id)

    console.log('Checking roles...')
    const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)

    if (rolesError) {
        console.error('Error fetching roles:', rolesError.message)
    } else {
        console.log('Assigned Roles:', roles.map(r => r.role))
    }
}

checkUser()
