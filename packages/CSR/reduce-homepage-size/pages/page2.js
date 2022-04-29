import mySvg from './page2.svg';

export default function() {
    document.querySelector('main').innerHTML = `
        <img src="${mySvg}" width="300"/>
    `
}