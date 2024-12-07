import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: vercel(), // Use the Vercel adapter
        paths: {
            base: '', // No base path since it's served from the root
        },
    },
    preprocess: vitePreprocess(), // Add preprocessors here
};

export default config;
