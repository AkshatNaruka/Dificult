import { createClient } from '@/utils/supabase/server';
import TypingTestApp from '@/components/TypingTest/TypingTestApp';

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data.user ? { email: data.user.email, id: data.user.id } : null;
    }
  } catch {
    // Auth unavailable — continue as guest
  }

  return <TypingTestApp user={user} />;
}
