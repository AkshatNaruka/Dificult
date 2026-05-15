import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { PricingPlans } from '@/components/Pricing/PricingPlans';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function PricingPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1">
                <div className="max-w-3xl mx-auto px-5 pt-14 pb-24 flex flex-col gap-10">
                    {/* Hero */}
                    <div className="text-center space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] font-typing" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                            One-time pricing
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Unlock the full experience
                        </h1>
                        <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-main)', opacity: 0.65 }}>
                            All themes are free. Packs unlock distraction modes, backgrounds, premium sounds, and cosmetic drops.
                        </p>
                    </div>

                    <PricingPlans />
                </div>
            </main>
        </div>
    );
}
