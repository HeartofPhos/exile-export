# Getting Started

## Exporting

### Local
```sh
# build image
docker build -t poe-export ./poe-export
# set env variable
POE_GAME_DIR="C:\Program Files (x86)\Steam\steamapps\common\Path of Exile"
# run image interactively
docker run --rm -it -v "${PWD}/workspace":/workspace -v "${POE_GAME_DIR}":/game poe-export
# extract files
dat2json /game ./exports ./dat-list.txt
```

### Steam Download

- See [steam-dl](steam-dl/README.md)

```sh
# build image
docker build -t poe-export ./poe-export
# run image interactively
docker run --rm -it -v "${PWD}/workspace":/workspace poe-export`
# extract files
dat2json /game ./exports ./dat-list.txt
```

#### Discover & Extract games files with regex

```sh
# write all dat64 filenames to bundle-files.txt
bun_extract_file list-files /game | grep "data\/[^/]*\.dat64$" > bundle-files.txt
# extract all files in bundle-files.txt
cat bundle-files.txt | xargs -d '\n' bun_extract_file extract-files /game ./exports
```

## Troubleshooting

- This assumes the steam version of the game, exporting the GGG launcher version should be possible by replacing `/game` with `/game/Content.ggpk` where applicable
- `Git Bash` on Windows has issue with paths, the `/workspace` directory will be empty unless `${PWD}` is escaped using `//${PWD}` or by setting `MSYS_NO_PATHCONV=1`

## References

- https://github.com/SnosMe/poe-dat-viewer
- https://github.com/zao/ooz
- https://github.com/SteamRE/DepotDownloader/
