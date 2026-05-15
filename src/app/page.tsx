import { createClient } from '@/utils/supabase/server';
import TypingTestApp from '@/components/TypingTest/TypingTestApp';
import LandingPage from '@/app/landing/LandingPage';

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    return <LandingPage />;
  }

  return <TypingTestApp user={{ email: user.email, id: user.id }} />;
}
