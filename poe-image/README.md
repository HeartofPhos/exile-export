## Extract & Convert DDS to PNG

- Requires `poe-export` image
- Build image `docker build -t poe-img ./img-processing`
- Run image interactively `docker run --rm -it -v ${PWD}/workspace:/workspace poe-img`
- `bun_extract_file list-files /game | grep "InGame\/.*\.dds$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files /game ./exports`
- `find ./exports -name "*.dds" | sed 's/\.dds$//' | xargs -d '\n' -I $ sh -c 'magick "$.dds" "$.png"; rm "$.dds"'`

## Image Atlas Files
- `bun_extract_file list-files /game | grep "Art\/.*\.txt$" > bundle-files.txt`
