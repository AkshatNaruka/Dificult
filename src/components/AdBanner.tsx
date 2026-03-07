'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>;
    }
}

export function AdBanner({ slot, format = 'auto', responsive = true, className = '', style }: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        if (isLoaded.current) return;

        try {
            if (typeof window !== 'undefined' && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

    // Don't render anything if AdSense isn't configured
    if (!adClient) {
        return null;
    }

    return (
        <div className={className} style={style}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={adClient}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}

// Sidebar ad - 300x250 or responsive
export function SidebarAd() {
    return (
        <AdBanner
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ''}
            format="rectangle"
            className="hidden lg:block"
            style={{ minWidth: '300px', minHeight: '250px' }}
        />
    );
}

// Bottom banner ad - 728x90 or responsive
export function BottomBannerAd() {
    return (
        <AdBanner
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''}
            format="horizontal"
            className="w-full"
            style={{ minHeight: '90px' }}
        />
    );
}
