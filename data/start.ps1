DepotDownloader `
    -username $env:STEAM_USERNAME `
    -password $env:STEAM_PASSWORD `
    -app 238960 `
    -depot 238961 `
    -manifest 1110579769845026063 `
    -dir "./game" `
    -filelist "./file-list.txt"

New-Item -ItemType Directory -Force -Path ./out_dir
New-Item -ItemType Directory -Force -Path ./temp_dir
New-Item -ItemType Directory -Force -Path ./split

pypoe_exporter config set out_dir ./out_dir
pypoe_exporter config set temp_dir ./temp_dir
pypoe_exporter config set ggpk_path ./game
pypoe_exporter setup perform

$dat_list = Get-Content ./dat-list.txt
pypoe_exporter dat json ./out.json --files $dat_list

$out_json = Get-Content ./out.json -raw | ConvertFrom-Json
foreach ($dat in $out_json) {
    $dat | ConvertTo-Json -Compress | Out-File -FilePath "./split/$($dat.filename).json"
}