#!/bin/bash
DepotDownloader \
    -username $STEAM_USERNAME \
    -password $STEAM_PASSWORD \
    -app 238960 \
    -depot 238961 \
    -manifest 1110579769845026063 \
    -dir "./game" \
    -filelist "./file-list.txt"

mkdir -p "./pypoe/out_dir"
mkdir -p "./pypoe/temp_dir"
mkdir -p "./exports"

pypoe_exporter config set out_dir "./pypoe/out_dir"
pypoe_exporter config set temp_dir "./pypoe/temp_dir"
pypoe_exporter config set ggpk_path "./game"
pypoe_exporter setup perform

pypoe_exporter dat json "./exports.json" --files $(cat "./dat-list.txt" | tr -s '\r\n' ' ' | tr -s '\n' ' ')

python3 split.py "./exports.json" "./exports"