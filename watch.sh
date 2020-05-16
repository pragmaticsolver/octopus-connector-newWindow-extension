#!/bin/bash

while inotifywait -e close_write -r src/; do
    bash build.sh;
done
    
