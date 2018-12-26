"use strict";

(function() {
    let _data = null;

    function createLink(text, href) {
        const link = document.createElement('A');
        link.setAttribute('href', href);
        link.innerHTML = text;
        return link;
    }

    function clear(element) {
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }

    function cell(text, className, title = '') {
        const cell = document.createElement('TD');
        cell.innerText = text;
        cell.className = className;
        cell.title = title;
        return cell;
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

    function render(data) {
        const num = location.hash.trim().substr(1);

        const title = document.getElementById('fff-title');

        let items;
        if (num === 'overview' || num === '') {
            title.innerText = 'Overview of all pages';

            items = sumCounts(data).entries();
        } else {
            const entry = data[num];
            if (!entry || !entry.counts) {
                title.innerText = 'No FFF found for ' + num;
                return;
            }

            clear(title);
            title.appendChild(createLink(entry.title, 'https://www.factorio.com/blog/post/fff-' + num));

            items = Object.entries(entry.counts);
        }

        const sorted = new Map([...items].sort((a, b) => b[1] - a[1]));

        const wordList = document.getElementById('wordlist-table-body');
        clear(wordList);

        const allWords = [];
        for (const [word, count] of sorted.entries()) {
            const isStopWord = stopWords.test(word.toLowerCase());

            const row = document.createElement('TR');
            isStopWord && (row.className = 'excluded');
            row.appendChild(cell((isStopWord ? '✗' : '✓') + ' ' + word, 'cell-word', word));
            row.appendChild(cell(count, 'cell-count'));
            wordList.appendChild(row);

            if (!isStopWord) {
                for (let i = 0; i < count; i++) {
                    allWords.push(word);
                }
            }
        }

        wordcloud_parseText(allWords.join(' '));
        window.scroll(0, 0);
    }

    function loadData() {
        fetch('all-counts.json')
            .then(resp => resp.ok ? resp.json() : Promise.reject(resp.statusText))
            .then(data => {
                _data = data;

                const fffList = document.getElementById('fff-list');
                Object.keys(data).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)).forEach(num => {
                    const li = document.createElement('LI');
                    const title = data[num].title;
                    li.appendChild(createLink(title.includes('-') || title.includes('#84 ') ? title.replace('Friday Facts ', '') : title, '#' + num));
                    fffList.appendChild(li);
                });

                render(data);
            })
            .catch(error => {
                console.error('Error loading data', error);
                document.getElementById('fff-title').innerText = 'Error loading word count data: ' + error;
            });
    }

    window.addEventListener('hashchange', () => render(_data), false);
    window.addEventListener('load', () => loadData(), false);
})();
