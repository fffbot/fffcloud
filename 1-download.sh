#!/bin/bash

cd html

for i in {1..272}; do
  if [[ ! -f fff-${i} ]]; then
    wget https://factorio.com/blog/post/fff-${i} || echo ${i} failed >> ./failures.log
  fi
done
