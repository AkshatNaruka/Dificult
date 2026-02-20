'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveTestStats(
    wpm: number,
    accuracy: number,
    mode: string,
    timeTaken: number
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Calculate XP gained based on WPM and Accuracy
    const xpGained = Math.round((wpm * (accuracy / 100)) + (timeTaken / 2))

    // 1. Insert the stat record
    const { error: statError } = await supabase
        .from('stats')
        .insert({
            user_id: user.id,
            wpm,
            accuracy,
            mode
        })

    if (statError) {
        console.error('Error saving stat:', statError)
        return { success: false, error: statError.message }
    }

    // 2. Update the user's profile XP
    // First, get current XP
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', user.id)
        .single()

    if (profile) {
        const newXp = (profile.xp || 0) + xpGained
        // Simple leveling logic: Every 1000 XP is a level
        const newLevel = Math.floor(newXp / 1000) + 1

        await supabase
            .from('profiles')
            .update({ xp: newXp, level: newLevel })
            .eq('id', user.id)
    }

    // Revalidate profile page so new stats immediately show up
    revalidatePath('/profile')

    return { success: true, xpGained }
}
