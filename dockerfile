FROM debian:11.6

RUN apt update
RUN apt install wget -y
RUN apt install git -y

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

# Exporter
RUN apt install -y nodejs
RUN apt install -y npm

# Install ooz
WORKDIR /ooz
RUN git clone https://github.com/zao/ooz.git .
RUN git reset --hard f8f333d37409f187bc94527b44ac99a999983e09
WORKDIR /ooz/build
# Set RPATH so liblibbun.so can load liblibooz.so
# https://github.com/zao/ooz/blob/dd51c6347f046fea3bd68fbab3485193575a85c2/bun_extract_file.cpp#L88
# https://github.com/zao/ooz/blob/dd51c6347f046fea3bd68fbab3485193575a85c2/bun.cpp#L117
RUN cmake .. -D CMAKE_BUILD_RPATH='$ORIGIN'
RUN cmake --build .
ENV PATH="${PATH}:/ooz/build"

# Install DepotDownloader
WORKDIR /DepotDownloader
RUN git clone https://github.com/SteamRE/DepotDownloader.git .
RUN dotnet publish . -o ./build
ENV PATH="${PATH}:/DepotDownloader/build"

# Install Exporter
COPY /dat2json /dat2json
WORKDIR /dat2json
RUN npm i
RUN npm run build
RUN npm i -g

WORKDIR /data