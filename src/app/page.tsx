import { createClient } from '@/utils/supabase/server';
import TypingTestApp from '@/components/TypingTest/TypingTestApp';

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <TypingTestApp user={user ? { email: user.email, id: user.id } : null} />
  );
}
