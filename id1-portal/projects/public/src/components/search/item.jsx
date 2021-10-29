import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from "../../services/helpers.js";

const createContentForView = (arrayWords, res) => {
    var textSearch = res.sort(function (a, b) { return b.length - a.length });
    var tempcontent = [];
    var isСoincidence = false;
    var wordsAfterСoincidence = 0;
    const wordsOnPage = 25;

    var i;
    for (i = 0; i < arrayWords.length; i++) {
        var j;
        for (j = 0; j < textSearch.length; j++) {
            if (arrayWords[i].toLowerCase().includes(textSearch[j].toLowerCase())) {
                var regex = new RegExp(textSearch[j].toLowerCase(), 'gi')
                var s = arrayWords[i].match(regex)[0];
                arrayWords[i] = arrayWords[i].replace(regex, "<mark style='background-color: yellow;'>" + s + "</mark>");
                isСoincidence = true;
            }
        }
        tempcontent.push(arrayWords[i]);
        if (wordsAfterСoincidence == 20) break;
        if (isСoincidence) wordsAfterСoincidence++;
    }

    if (tempcontent.length == arrayWords.length & tempcontent.length > wordsOnPage & !isСoincidence) {
        tempcontent = tempcontent.splice(0, wordsOnPage);
        tempcontent.push("...")
        return tempcontent.join(' ');
    }
    if (tempcontent.length == arrayWords.length & tempcontent.length > wordsOnPage) {
        var remoteElement = tempcontent.length - wordsOnPage;
        tempcontent = tempcontent.splice(remoteElement, tempcontent.length);
        tempcontent.unshift("...");
        return tempcontent.join(' ');
    }
    if (tempcontent.length < arrayWords.length) {
        tempcontent.push("...");

    }
    if (tempcontent.length > wordsOnPage) {
        var remoteElement = tempcontent.length - wordsOnPage;
        tempcontent = tempcontent.splice(remoteElement, tempcontent.length);
        tempcontent.unshift("...");
    }
    return tempcontent.join(' ');
}

export class Item extends Component {
    render() {
        var { title, textSearch, date, translate, content, id, url } = this.props;
        var dateOfPublication = date ? formatDate(date, translate('localeCode')) : null;
        var tempTextSearch = textSearch.trim().split(" ");
        var resTitle = title.split(" ");
        var tempElement = document.createElement("div");
        tempElement.innerHTML = content;
        var resContent = tempElement.innerText.split(/[  ]/);

        if (url.includes(`{id}`))
            url = url.replace('{id}', id)
        else
            url = url + `/${id}`

        return (
            <div>
                <h3 className="post-title title-large p-2 resultItemTitle">
                    {(dateOfPublication) ? <p className="text-muted date resultItemDate">{dateOfPublication}</p> : null}
                    <Link className="post-title title-large" to={ url }>
                        <div dangerouslySetInnerHTML={{ __html: createContentForView(resTitle, tempTextSearch) }}>
                        </div>
                    </Link>
                </h3>
                <div className="p-2 clip resultItemContent">
                    <div className="entry-content" dangerouslySetInnerHTML={{ __html: createContentForView(resContent, tempTextSearch) }}></div>
                </div>
            </div>
        );
    }
}