let cache: any;

export async function getWebsiteConfig() {
    if (!cache) {
        cache = await loadWebsiteConfig();
    }
    return cache;
}

async function loadWebsiteConfig() {
    if (import.meta.env.SSR) {
        // simulate reading from database
        return { someConfigKey: '=== blah ===' };
    } else {
        // generate.ts will generate website-config.js
        // server.ts will provide route for /website-config.js
        const loc = '/website-config.js' as any;
        return (await import(/* @vite-ignore */loc)).default;
    }
}