'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    if (!supabase) {
        redirect('/login?error=' + encodeURIComponent('Authentication is not configured'))
    }

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    if (!supabase) {
        redirect('/login?error=' + encodeURIComponent('Authentication is not configured'))
    }

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Check email to continue sign in process')
}

export async function loginWithGoogle() {
    const supabase = await createClient()

    if (!supabase) {
        redirect('/login?error=' + encodeURIComponent('Authentication is not configured'))
    }

    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    if (data.url) {
        redirect(data.url)
    }

    redirect('/login?error=' + encodeURIComponent('Could not initiate Google sign-in'))
}

export async function logout() {
    const supabase = await createClient()
    if (supabase) {
        await supabase.auth.signOut()
    }
    revalidatePath('/', 'layout')
    redirect('/')
}
