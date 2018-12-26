#!/bin/bash

BASEDIR=html

for i in {1..274}; do
  OUTFILE=${BASEDIR}/fff-${i}.html
  if [[ ! -f ${OUTFILE} ]]; then
    curl -o ${OUTFILE} https://factorio.com/blog/post/fff-${i} || echo ${i} failed >> ./download-failures.log
  fi
done
