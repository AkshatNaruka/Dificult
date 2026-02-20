import { createClient } from '@/utils/supabase/server';
import MultiplayerLobby from '@/components/Multiplayer/MultiplayerLobby';

export default async function MultiplayerPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <MultiplayerLobby user={user ? { email: user.email, id: user.id } : null} />
    );
}
