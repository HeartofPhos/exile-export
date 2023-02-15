# Getting Started

## Game Data

### Manual

- Copy the contents of the `Path of Exile` game directory to `./data/game`

### Download

- Create a `./steam-dl/.env` file, see `./steam-dl/sample.env`, recommend creating a dedicated Steam account and disabling Steam Guard
- Update `./steam-dl/file-list.txt` with files to download, more info [DepotDownloader](https://github.com/SteamRE/DepotDownloader)
- Build image `docker build -t steam-dl ./steam-dl`
- Run image `docker run --rm -v ${PWD}/data:/data -v ${PWD}/steam-dl/file-list.txt:/file-list.txt --env-file ./steam-dl/.env steam-dl`

## Exporting

- Create a `.env` file, see `sample.env`
- Build image `docker build -t poe-export .`
- Run image interactively `docker run --rm -it -v ${PWD}/data:/data --env-file .env poe-export`
- Update `./data/scripts/dat-list.txt` with the `.dat` files to export
- Run `./scripts/export-json.sh`
- Data will be exported to `./data/exports/Data`

#### Discover & Extract games files with regex

- `bun_extract_file list-files ./game | grep "Data\/[^/]*\.dat64$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files ./game ./exports`

#### Extract & Convert DDS to PNG

- Requires `poe-export` image
- Build image `docker build -t poe-img ./img-processing`
- Run image interactively `docker run --rm -it -v ${PWD}/data:/data --env-file .env poe-img`
- `bun_extract_file list-files ./game | grep "InGame\/.*\.dds$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files ./game ./exports`
- `find ./exports -name "*.dds" | sed 's/\.dds$//' | xargs -d '\n' -I $ sh -c 'magick "$.dds" "$.png"; rm "$.dds"'`

## Troubleshooting

- `Git Bash` on Windows has issue with paths, the `/data` directory will be empty unless `${PWD}` is escaped using `//${PWD}` or by setting `MSYS_NO_PATHCONV=1`

## References

- https://github.com/SnosMe/poe-dat-viewer
- https://github.com/zao/ooz
- https://github.com/SteamRE/DepotDownloader/
