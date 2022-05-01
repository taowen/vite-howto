export default function() {
    return {
        title: 'Page 1',
        view: '<div>this is page 1</div>',
        hydrate: () => {
            document.body.addEventListener('click', () => {
                alert('clicked page 1');
            })
        }
    }
}