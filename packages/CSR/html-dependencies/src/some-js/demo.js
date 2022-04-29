const img = document.createElement('img');
img.setAttribute('src', new URL('./demo-dynamic.svg', import.meta.url).href);
img.setAttribute('width', '300');
document.body.appendChild(img);