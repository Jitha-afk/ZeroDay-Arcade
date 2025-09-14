"use client";
import { useEffect, useRef } from 'react';

/**
 * Dynamically injects the Unicorn Studio script and mounts the project.
 * Keeps idempotent initialization to avoid duplicate loads (mirrors provided snippet).
 */
export function UnicornBackground() {
  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-unicorn-studio]');
    if (existing) return; // Script already present

    const script = document.createElement('script');
    script.setAttribute('data-unicorn-studio', 'true');
    script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js';
    script.onload = () => {
      try {
        const US = (window as any).UnicornStudio;
        if (US && !US.isInitialized && typeof (window as any).UnicornStudio.init === 'function') {
          (window as any).UnicornStudio.init();
          US.isInitialized = true;
        }
      } catch (e) {
        // Silently fail; background is progressive enhancement
        if (process.env.NODE_ENV !== 'production') {
          console.warn('UnicornStudio initialization failed', e);
        }
      }
    };
    (document.head || document.body).appendChild(script);
  }, []);

  return null; // purely side-effect
}
