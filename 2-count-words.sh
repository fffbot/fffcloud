#!/bin/bash

for f in html/fff-*.html; do
  FILENAME=$(basename $f)
  NO_EXT=${FILENAME::-5}

  python3 count_words.py $f counts/${NO_EXT}.json
done
