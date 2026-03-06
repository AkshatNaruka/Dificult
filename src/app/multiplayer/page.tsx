import { createClient } from '@/utils/supabase/server';
import MultiplayerLobby from '@/components/Multiplayer/MultiplayerLobby';

export default async function MultiplayerPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    return (
        <MultiplayerLobby user={user ? { email: user.email, id: user.id } : null} />
    );
}
