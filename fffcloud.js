"use strict";

const _data = {data: null};

function getData() {
    if (_data.data) {
        return _data.data;
    }
}

function setData(newData) {
    _data.data = newData;
}

function createLink(text, href) {
    const link = document.createElement('A');
    link.setAttribute('href', href);
    link.innerHTML = text;
    return link;
}

function refreshCurrentPage() {
    const num = location.hash.trim().substr(1);
    showCloudFor(num);
}

function clear(element) {
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}

function cell(text, className = '', title = '') {
    const cell = document.createElement('TD');
    cell.innerText = text;
    cell.className = className;
    cell.title = title;
    return cell;
}

function row(word, count) {
    const stop = isStopWord(word);
    const wordCell = cell((stop ? '✗' : '✓') + ' ' + word, 'cell-word', word);
    // ✓
    const countCell = cell(count, 'cell-count');

    const row = document.createElement('TR');
    if (stop) {
        row.className = 'excluded';
    }
    row.appendChild(wordCell);
    row.appendChild(countCell);
    return row;
}

function sumCounts(data) {
    const countsByWord = new Map();

    Object.values(data).forEach(item => {
        Object.entries(item.counts).forEach(([word, count]) => {
            const cur = countsByWord.get(word) || 0;
            countsByWord.set(word, cur + count);
        });
    });

    return countsByWord;
}

function showCloudFor(num) {
    const title = document.getElementById('fff-title');
    const data = getData();

    if (num === 'overview' || num === '') {
        title.innerText = 'Overview :)';

        fillWordList(sumCounts(_data).entries());
    } else {
        const entry = data[num];
        if (!entry || !entry.counts) {
            title.innerText = 'No FFF found for ' + num;
            return;
        }

        //caption.innerText = 'Would show cloud for ' + num + ' (' + entry.title + ')';
        const link = createLink(entry.title, '#' + num);
        title.innerHTML = '<a href="#' + num + '">' + entry.title + '</a>';

        fillWordList(Object.entries(entry.counts));
    }

    window.scroll(0, 0);
}

function isStopWord(word) {
    return stopWords.test(word.toLowerCase());
}

function fillWordList(entries) {
    const sorted = new Map([...entries].sort((a, b) => b[1] - a[1]));

    const wordList = document.getElementById('wordlist-table-body');
    clear(wordList);

    const allWords = [];
    for (const [word, count] of sorted.entries()) {

        wordList.appendChild(row(word, count));
        if (isStopWord(word)) {
            continue;
        }

        for (let i = 0; i < count; i++) {
            allWords.push(word);
        }
    }
    let txt = allWords.join(' ');
    wordcloud_parseText(txt);
}

function populateFffList(data) {
    const fffList = document.getElementById('fff-list');
    Object.keys(data).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)).forEach(num => {
        const li = document.createElement('LI');
        const title = data[num].title;
        const x = title.includes('-') ? title.replace('Friday Facts ', '') : title;
        li.appendChild(createLink(x, '#' + num));
        fffList.appendChild(li);
    });
}

function loadData() {
    fetch('all-counts.json')
        .then(resp => resp.ok ? resp.json() : Promise.reject(resp.statusText))
        .then(data => {
            setData(data);
            populateFffList(data);
            refreshCurrentPage();
        })
        .catch(error => {
            document.getElementById('fff-title').innerText = 'Error loading word count data: ' + error;
        });
}

window.addEventListener("hashchange", refreshCurrentPage, false);
window.onload = () => {
    document.getElementById('show-excluded').addEventListener('change', e => {
        console.log('change', e.target.checked);
    });

    window.addEventListener('resize', e => {
        //console.log('resize', e);
        const w = window.innerWidth;
        const h = window.innerHeight;
        document.title = w + 'x' + h;
    });

    loadData();
};
