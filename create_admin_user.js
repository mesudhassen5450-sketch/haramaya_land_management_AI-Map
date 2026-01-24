
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdguhjvkvouvwjboklet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3VoanZrdm91dndqYm9rbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwODMsImV4cCI6MjA4MzI5NTA4M30.D9-c1Cnr2abB57gYoCUkIZS4z_AxtTnnSScbUb6-b10'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
    console.log('Attempting to create user...')

    const { data, error } = await supabase.auth.signUp({
        email: 'itechnology416@gmail.com',
        password: '688587@#$%',
        options: {
            data: {
                full_name: 'System Admin',
            },
        }
    })

    if (error) {
        console.error('Error creating user:', error.message)
    } else {
        console.log('User creation result:', data)
        console.log('User ID:', data.user?.id)
    }
}

createAdmin()
