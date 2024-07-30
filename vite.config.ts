/**
 * Vite Configuration
 * 
 * This file defines the configuration for Vite, a build tool that provides a fast and efficient development environment.
 * This file configures the Vite PWA plugin, which enables PWA features for the application.
 * It defines how the PWA should be registered, assets to include, and the web app manifest.
 */


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: 'prompt',
    devOptions: {
        enabled: false,
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
        name: 'eSwasthya Dham',
        short_name: 'eSwasthya Dham',
        icons: [
            {
                src: 'pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png',
            },
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        theme_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
    },
    workbox: {
        additionalManifestEntries: [
            { url: '/Terms-and-conditions.htm', revision: '1' },
            { url: '/Iconic-Advisory.pdf', revision: '1' },
        ],
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin)],
})
