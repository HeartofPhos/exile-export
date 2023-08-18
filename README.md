# Getting Started

## Game Data

### Manual

- Copy the contents of the `Path of Exile` game directory to `./workspace/game`

### Steam Download

- See [steam-dl](steam-dl/README.md)

## Exporting

- Build image `docker build -t poe-export ./poe-export`
- Run image interactively `docker run --rm -it -v ${PWD}/workspace:/workspace poe-export`
- Update `./workspace/dat-list.txt` with the `.dat` files to export
- Run `dat2json ./game ./exports ./dat-list.txt`
- Data will be exported to `./workspace/exports`

#### Discover & Extract games files with regex

- `bun_extract_file list-files ./game | grep "data\/[^/]*\.dat64$" > bundle-files.txt`
- `cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files ./game ./exports`

## Troubleshooting

- This assumes the steam version of the game, exporting the GGG launcher version should be possible by replacing `./game` with `./game/Content.ggpk` where applicable
- `Git Bash` on Windows has issue with paths, the `/workspace` directory will be empty unless `${PWD}` is escaped using `//${PWD}` or by setting `MSYS_NO_PATHCONV=1`

## References

- https://github.com/SnosMe/poe-dat-viewer
- https://github.com/zao/ooz
- https://github.com/SteamRE/DepotDownloader/
