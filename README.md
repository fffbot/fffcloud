# Factorio Friday Facts word cloud

See it in action: https://fffbot.github.io/fffcloud/

Uses the word cloud script by Jason Davies: [jasondavies.com/wordcloud](https://www.jasondavies.com/wordcloud/)

Not related to Factorio or Wube Software. Buy Factorio at: [factorio.com](https://www.factorio.com/)

# Usage

Requires Bash, Python 3, and [jq](https://stedolan.github.io/jq/).

- Run `1-download.sh` to download all the Friday Facts blog posts into the `html/` directory
- Then `2-count-words.sh` (which uses `count_words.py`) to process all the HTML files, count words, and put them into JSON files in the `counts/` directory
- Finally `3-merge-counts.sh` to combine all the JSON files into `all-counts.json` in the `docs/` directory (which is set up to be used by [GitHub Pages](https://pages.github.com/))

