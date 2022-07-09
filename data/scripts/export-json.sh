#!/bin/bash
mkdir -p "$EXPORT_PYPOE_DIR/out_dir"
mkdir -p "$EXPORT_PYPOE_DIR/temp_dir"
mkdir -p "$EXPORT_DIR"

pypoe_exporter config set out_dir "$EXPORT_PYPOE_DIR/out_dir"
pypoe_exporter config set temp_dir "$EXPORT_PYPOE_DIR/temp_dir"
pypoe_exporter config set ggpk_path "$DOWNLOAD_DIR"
pypoe_exporter setup perform

TMP_FILE=$(mktemp)
trap "rm -f $TMP_FILE" EXIT

pypoe_exporter dat json "$TMP_FILE" --files $(cat "$EXPORT_DAT_LIST" | tr -s '\r\n' ' ' | tr -s '\n' ' ')
python3 "/data/scripts/split.py" "$TMP_FILE" "$EXPORT_DIR"