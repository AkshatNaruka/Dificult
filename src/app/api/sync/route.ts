import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Merge local guest stats into Supabase profile
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { stats } = body;

        if (!stats) {
            return NextResponse.json({ error: 'Missing local stats' }, { status: 400 });
        }

        // Fetch current profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        // Merge logic: only merge if local stats exceed or simply add them
        // For total counts we add them. For bests we take the max.

        const newTotalTests = (profile.total_tests || 0) + (stats.totalTests || 0);

        // If they already synced or have more tests on DB, skip additive to prevent double-counting.
        // A safer heuristic: just take the max if we don't want to double count, but let's do a simple max for now 
        // to prevent inflation if they sync multiple times.
        const mergedStats = {
            total_tests: Math.max(profile.total_tests || 0, stats.totalTests || 0),
            total_time: Math.max(profile.total_time || 0, stats.totalTime || 0),
            xp: Math.max(profile.xp || 0, stats.xp || 0),
            best_wpm: Math.max(profile.best_wpm || 0, stats.bestWpm || 0),
            best_accuracy: Math.max(profile.best_accuracy || 0, stats.bestAccuracy || 0),
            characters_typed: Math.max(profile.characters_typed || 0, stats.charactersTyped || 0),
            words_typed: Math.max(profile.words_typed || 0, stats.wordsTyped || 0),
            games_played: Math.max(profile.games_played || 0, stats.gamesPlayed || 0),
            longest_streak: Math.max(profile.longest_streak || 0, stats.longestStreak || 0),
            level: 1
        };

        mergedStats.level = Math.floor(mergedStats.xp / 1000) + 1;

        const { error: updateError } = await supabase
            .from('profiles')
            .update(mergedStats)
            .eq('id', user.id);

        if (updateError) {
            console.error('Error merging profile:', updateError);
            return NextResponse.json({ error: 'Failed to merge stats' }, { status: 500 });
        }

        return NextResponse.json({ success: true, merged: true });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
