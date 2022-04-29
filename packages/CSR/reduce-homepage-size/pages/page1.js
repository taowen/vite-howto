import mySvg from './page1.svg';

export default function() {
    document.querySelector('main').innerHTML = `
        <img src="${mySvg}" width="300"/>
    `
}