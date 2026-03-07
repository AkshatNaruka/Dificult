import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get user achievements
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'No client' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get unlocked achievements
        const { data: unlocked, error } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at, achievements(*)')
            .eq('user_id', user.id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Get all catalog achievements to send back which ones are still locked
        const { data: allAchievements } = await supabase.from('achievements').select('*');

        return NextResponse.json({
            unlocked: unlocked || [],
            catalog: allAchievements || []
        });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// Evaluate and unlock achievements based on current stats
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'No client' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        // Fetch already unlocked
        const { data: unlocked } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', user.id);

        const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);
        const newlyUnlocked = [];

        // Quick evaluation logic mapped to seeded IDs
        const toCheck = [];

        if (profile.total_tests >= 1) toCheck.push('first_test');
        if (profile.total_tests >= 10) toCheck.push('tests_10');
        if (profile.total_tests >= 50) toCheck.push('tests_50');
        if (profile.total_tests >= 100) toCheck.push('tests_100');
        if (profile.total_tests >= 500) toCheck.push('tests_500');

        if (profile.best_wpm >= 30) toCheck.push('speed_30');
        if (profile.best_wpm >= 50) toCheck.push('speed_50');
        if (profile.best_wpm >= 80) toCheck.push('speed_80');
        if (profile.best_wpm >= 100) toCheck.push('speed_100');
        if (profile.best_wpm >= 120) toCheck.push('speed_120');
        if (profile.best_wpm >= 150) toCheck.push('speed_150');

        if (profile.best_accuracy >= 95) toCheck.push('accuracy_95');
        if (profile.best_accuracy >= 99) toCheck.push('accuracy_99');
        if (profile.best_accuracy >= 100) toCheck.push('accuracy_100');

        if (profile.longest_streak >= 3) toCheck.push('streak_3');
        if (profile.longest_streak >= 7) toCheck.push('streak_7');
        if (profile.longest_streak >= 30) toCheck.push('streak_30');

        if (profile.daily_challenges_completed >= 1) toCheck.push('daily_1');
        if (profile.daily_challenges_completed >= 7) toCheck.push('daily_7');

        if (profile.games_played >= 1) toCheck.push('multiplayer_1'); // assuming games_played tracks MP

        if (profile.xp >= 1000) toCheck.push('xp_1000');
        if (profile.xp >= 5000) toCheck.push('xp_5000');
        if (profile.xp >= 10000) toCheck.push('xp_10000');

        // Execute unlocks
        for (const ach_id of toCheck) {
            if (!unlockedIds.has(ach_id)) {
                const { error } = await supabase
                    .from('user_achievements')
                    .insert({ user_id: user.id, achievement_id: ach_id });

                if (!error) newlyUnlocked.push(ach_id);
            }
        }

        // If newly unlocked, could grant XP from achievement reward (for future optimization)

        return NextResponse.json({ success: true, newlyUnlocked });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
