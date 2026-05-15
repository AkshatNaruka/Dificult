import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { StoreCatalog } from '@/components/Store/StoreCatalog';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function StorePage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1">
                <div className="max-w-5xl mx-auto px-5 pt-12 pb-24 flex flex-col gap-10">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div
                            className="text-xs uppercase tracking-[0.32em]"
                            style={{ color: 'var(--text-main)', opacity: 0.5 }}
                        >
                            Pack store
                        </div>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Themes, sounds &amp; backgrounds
                        </h1>
                        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-main)', opacity: 0.65 }}>
                            All themes are free. Packs unlock distraction backgrounds, extra sound profiles, and cosmetics.
                        </p>
                    </div>

                    {entitlements.adsEnabled && (
                        <div className="flex justify-center">
                            <AdBanner
                                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''}
                                format="horizontal"
                                className="w-full"
                                style={{ minHeight: '90px' }}
                            />
                        </div>
                    )}

                    <StoreCatalog />
                </div>
            </main>
        </div>
    );
}
