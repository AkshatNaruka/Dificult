import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { createBrowserClient } from '@supabase/ssr';

export function useSupabaseSync() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const playerState = usePlayerStore(state => state.player);

    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

        const checkAuthAndSync = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);

            if (session && playerState && !localStorage.getItem('dificult-synced-v1')) {
                // First time login sync
                setIsSyncing(true);
                try {
                    await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ stats: playerState.stats })
                    });
                    localStorage.setItem('dificult-synced-v1', 'true');
                } catch (e) {
                    console.error('Failed to sync to Supabase', e);
                } finally {
                    setIsSyncing(false);
                }
            }
        };

        checkAuthAndSync();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setIsAuthenticated(!!session);
            if (event === 'SIGNED_IN' && playerState) {
                // trigger sync
                try {
                    await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ stats: playerState.stats })
                    });
                    localStorage.setItem('dificult-synced-v1', 'true');
                    // Force reload profile from DB
                    window.location.href = '/?synced=true';
                } catch (e) {
                    console.error('Sync failed', e);
                }
            }
            if (event === 'SIGNED_OUT') {
                localStorage.removeItem('dificult-synced-v1');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [playerState]);

    return { isAuthenticated, isSyncing };
}
