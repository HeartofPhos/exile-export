#!/bin/bash
DepotDownloader \
    -username $STEAM_USERNAME \
    -password $STEAM_PASSWORD \
    -app $DOWNLOAD_APP_ID \
    -depot $DOWNLOAD_DEPOT_ID \
    -dir $DOWNLOAD_DIR \
    -filelist $DOWNLOAD_FILE_LIST