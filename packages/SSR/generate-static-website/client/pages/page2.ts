export default function() {
    return {
        title: 'Page 2',
        view: '<div>this is page 2</div>',
        hydrate: () => {
            document.body.addEventListener('click', () => {
                alert('clicked page 2');
            })
        }
    }
}