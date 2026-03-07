import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
        const { wpm, accuracy, mode, duration, charactersTyped, xpGained } = body;

        // Ensure required fields
        if (wpm === undefined || accuracy === undefined || !mode || !duration || charactersTyped === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert test history
        const { error: testError } = await supabase
            .from('test_history')
            .insert({
                user_id: user.id,
                wpm,
                accuracy,
                mode,
                duration,
                characters_typed: charactersTyped,
                xp_gained: xpGained || 0
            });

        if (testError) {
            console.error('Error inserting test history:', testError);
            return NextResponse.json({ error: 'Failed to save test result' }, { status: 500 });
        }

        // 2. Fetch current profile to update stats
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            return NextResponse.json({ error: 'Failed to update profile stats' }, { status: 500 });
        }

        // 3. Calculate new stats
        const newXp = (profile.xp || 0) + (xpGained || 0);
        const newLevel = Math.floor(newXp / 1000) + 1;
        const newBestWpm = Math.max(profile.best_wpm || 0, wpm);
        const newBestAccuracy = Math.max(profile.best_accuracy || 0, accuracy);

        // Calculate new streak (simplified logic - just incrementing if playing today)
        const now = new Date();
        const lastPlayed = profile.last_played_date ? new Date(profile.last_played_date) : null;
        let newStreak = profile.streak || 0;
        let newLongestStreak = profile.longest_streak || 0;

        if (!lastPlayed) {
            newStreak = 1;
        } else {
            const todayStr = now.toISOString().split('T')[0];
            const lastPlayedStr = lastPlayed.toISOString().split('T')[0];

            if (todayStr !== lastPlayedStr) {
                // Did they play yesterday?
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastPlayedStr === yesterdayStr) {
                    newStreak += 1;
                } else {
                    newStreak = 1; // streak broken
                }
            }
            // if played today already, streak remains the same
        }

        newLongestStreak = Math.max(newLongestStreak, newStreak);

        // Update profile
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
                xp: newXp,
                level: newLevel,
                best_wpm: newBestWpm,
                best_accuracy: newBestAccuracy,
                total_tests: (profile.total_tests || 0) + 1,
                total_time: (profile.total_time || 0) + duration,
                characters_typed: (profile.characters_typed || 0) + charactersTyped,
                words_typed: (profile.words_typed || 0) + Math.floor(charactersTyped / 5),
                games_played: (profile.games_played || 0) + 1,
                streak: newStreak,
                longest_streak: newLongestStreak,
                last_played_date: now.toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating profile:', updateError);
            return NextResponse.json({ error: 'Failed to update profile stats' }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: updatedProfile });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limitStr = searchParams.get('limit');
        const limit = limitStr ? parseInt(limitStr) : 50;

        const { data: history, error } = await supabase
            .from('test_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching test history:', error);
            return NextResponse.json({ error: 'Failed to fetch test history' }, { status: 500 });
        }

        return NextResponse.json({ history });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
