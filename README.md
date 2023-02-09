## Getting Started

- Create `.env` file, see `sample.env`, recommend creating a dedicated Steam account and disabling Steam Guard
- Build image `docker build -t poe-export .`
- Optionally, manually copy the contents of the `Path of Exile` game directory to `./data/game`

## Exporting

- Run image interactively `docker run --rm -it -v ${PWD}/data:/data --env-file .env poe-export`
- If you have not manually copied the `Path of Exile` game files, run `./scripts/download-game.sh`
- Update `./data/scripts/dat-list.txt` with the `.dat` files to be exported
- Run `./scripts/export-json.sh`
- Data will be exported to `./data/exports/Data`

## Example Commands

- `./scripts/download-game.sh`
- `./scripts/export-json.sh`

#### Discover & Extract games files with regex

- `bun_extract_file list-files ./game | grep "Data\/[^/]*\.dat64$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files ./game ./exports`

#### Extract & Convert DDS to PNG

- `bun_extract_file list-files ./game | grep "InGame\/.*\.dds$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files ./game ./exports`
- `find ./exports -name "*.dds" | sed 's/\.dds$//' | xargs -d '\n' -I $ sh -c 'magick "$.dds" "$.png"; rm "$.dds"'`

## Troubleshooting

- `Git Bash` on Windows has issue with paths, the `/data` directory will be empty unless the image is run with `docker run --rm -it -v //${PWD}/data:/data --env-file .env poe-export`, note the `//${PWD}`

## References

- https://github.com/SnosMe/poe-dat-viewer
- https://github.com/zao/ooz
- https://github.com/SteamRE/DepotDownloader/
