import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
        }

        // Fetch top by WPM
        const { data: topWpm, error: wpmError } = await supabase
            .from('profiles')
            .select('id, email, display_name, avatar, best_wpm, best_accuracy, level')
            .order('best_wpm', { ascending: false })
            .limit(50);

        // Fetch top by XP/Level
        const { data: topXp, error: xpError } = await supabase
            .from('profiles')
            .select('id, email, display_name, avatar, xp, level')
            .order('xp', { ascending: false })
            .limit(50);

        if (wpmError || xpError) {
            console.error('Error fetching leaderboard:', wpmError || xpError);
            return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
        }

        return NextResponse.json({
            topWpm,
            topXp
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
