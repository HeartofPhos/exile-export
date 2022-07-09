## Getting Started
- Create `.env` file, see `sample.env`, recommend creating a dedicated Steam account and disabling Steam Guard
- Build image `docker build -t poe-export .`
- Run image `docker run --rm -it -v ${PWD}/data:/data --env-file .env poe-export`
- Execute commands

## Example Commands
- `./scripts/download-game.sh`
- `./scripts/export-json.sh`
- `bun_extract_file list-files ./game | grep "Data\/[^/]*\.dat$" > bundle-dat-files.txt`

## References
- https://github.com/SnosMe/poe-dat-viewer
- https://github.com/zao/ooz
- https://github.com/SteamRE/DepotDownloader/