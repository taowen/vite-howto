function handleLink() {
    const links = document.querySelectorAll('a[href^="/"]');
    for (const link of links) {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            window.history.pushState(undefined, '', url);
            replaceHtml(url);
        });
    }
}

async function replaceHtml(url) {
    const resp = await fetch(url)
    const html = await resp.text();
    document.documentElement.innerHTML = html;
    handleLink();
    for (const node of document.querySelectorAll('script')) {
        const script = document.createElement('script');
        for (let i = 0; i < node.attributes.length; i++) {
            script.setAttribute(node.attributes.item(i).name, node.attributes.item(i).value);
        }
        const src = new URL(script.getAttribute('src'), window.location.href);
        src.searchParams.append('t', new Date().getTime());
        script.setAttribute('src', src.toString());
        node.replaceWith(script);
    }
}

if (!window.handleLinkEnabled) {
    window.handleLinkEnabled = true;
    handleLink();
    window.addEventListener('popstate', () => {
        replaceHtml(window.location.href);
    })
}