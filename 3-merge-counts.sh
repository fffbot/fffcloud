#!/bin/bash

OUTFILE=all-counts-tmp.json
FINAL=all-counts.json
echo '{' > ${OUTFILE}

FIRST=1

for f in counts/fff-*.json; do
  if [[ "$FIRST" -ne "1" ]]; then
     echo ',' >> ${OUTFILE}
  else
    FIRST=0
  fi

  FILENAME=$(basename $f)
  NO_EXT=${FILENAME::-5}
  NR=${NO_EXT:4}

  echo '"'${NR}'": ' >> ${OUTFILE}
  cat ${f} >> ${OUTFILE}
done

echo '}' >> ${OUTFILE}

cat ${OUTFILE} | jq 'to_entries | sort_by(.key | tonumber) | from_entries' > ${FINAL}
rm -f ${OUTFILE}
