FROM debian:latest

RUN apt update
RUN apt install wget -y
RUN apt install git -y

# PyPoe
RUN apt install python3 -y
RUN apt install python3-pip -y

# ooz
RUN apt install build-essential -y
RUN apt install cmake -y
RUN apt install pkg-config -y
RUN apt install libsodium-dev -y
RUN apt install libunistring-dev -y

# DepotDownloader
RUN wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb
RUN apt update
RUN apt install dotnet-sdk-6.0 -y

# Install PyPoe
RUN pip install -e git+https://github.com/brather1ng/PyPoE#egg=pypoe[cli]

# Install ooz
WORKDIR /ooz
RUN git clone https://github.com/zao/ooz.git .
WORKDIR /ooz/build
RUN cmake ..
RUN cmake --build .
ENV PATH="${PATH}:/ooz/build"

# Install DepotDownloader
WORKDIR /DepotDownloader
RUN git clone https://github.com/SteamRE/DepotDownloader.git .
RUN dotnet publish . -o ./build
ENV PATH="${PATH}:/DepotDownloader/build"

WORKDIR /data