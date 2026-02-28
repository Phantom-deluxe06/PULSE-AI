import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref + boolean `isVisible`.
 * Triggers once when the element enters the viewport.
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // fire once
                }
            },
            { threshold: 0.15, ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
}
