/**
 * Created by rickhuang on 20/12/16.
 */

var cElem = function (html) {
    var docFrag = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
        docFrag.appendChild(div.firstChild)
    }

    return docFrag;

};