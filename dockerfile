FROM mcr.microsoft.com/windows:20H2

#Install chocolatey
RUN powershell Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

RUN choco install git -y
RUN choco install python -y
RUN choco install dotnet -y

#Install PyPoe
RUN pip install -e git+https://github.com/brather1ng/PyPoE#egg=pypoe[cli]

#Install DepotDownloader
WORKDIR /DepotDownloader
RUN curl -L https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip > DepotDownloader.zip
RUN tar -xf DepotDownloader.zip
RUN setx PATH "%PATH%;/DepotDownloader"

#Install ooz
WORKDIR /ooz
RUN curl -L https://github.com/powzix/ooz/releases/download/v7.0/ooz-7.0.zip > ooz.zip
RUN tar -xf ooz.zip
RUN setx PATH "%PATH%;/ooz/64bit"

WORKDIR /data
ENTRYPOINT ["powershell", "Set-ExecutionPolicy Bypass -Scope Process -Force;"]