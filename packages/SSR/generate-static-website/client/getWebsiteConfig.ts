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
        return {};
    }
}