/// <reference types="vite/client" />

export const pages = import.meta.glob('./pages/**/*.ts')

export async function render(url: string) {
    const loadPage = pages[`./pages${url}.ts`];
    if (!loadPage) {
        return undefined;
    }
    const { default: page } = await loadPage();
    const renderResult = await page();
    if (!renderResult) {
        return undefined;
    }
    return {
        modules: [`client/pages${url}.ts`],
        ...renderResult
    }
}
