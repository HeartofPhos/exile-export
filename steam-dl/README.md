## Download

- Create `./steam-dl/.env`, see `./steam-dl/sample.env`, recommend creating a dedicated Steam account and disabling Steam Guard
- Update `./steam-dl/file-list.txt` with files to download, more info [DepotDownloader](https://github.com/SteamRE/DepotDownloader)
- Build image `docker build -t steam-dl ./steam-dl`
- Run image `docker run --rm -v ${PWD}/workspace:/workspace -v ${PWD}/steam-dl/file-list.txt:/file-list.txt --env-file ./steam-dl/.env steam-dl`