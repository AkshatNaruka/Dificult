import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShopClient } from './ShopClient';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function ShopPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-28 pb-24 px-6 max-w-[1100px] mx-auto w-full">
                {entitlements.adsEnabled && (
                    <div className="flex justify-center mb-12">
                        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''} format="horizontal" className="w-full" style={{ minHeight: '90px' }} />
                    </div>
                )}
                <ShopClient />
            </main>

            <Footer />
        </div>
    );
}
