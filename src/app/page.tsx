import { createClient } from '@/utils/supabase/server';
import TypingTestApp from '@/components/TypingTest/TypingTestApp';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <TypingTestApp user={user ? { email: user.email, id: user.id } : null} />
  );
}
