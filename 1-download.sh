#!/bin/bash

cd html

for i in {0..273}; do
    wget https://factorio.com/blog/post/fff-${i} || echo ${i} failed >> ./failures.log
done
