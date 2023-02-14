FROM debian:11.6

RUN apt update
RUN apt install git -y

# ooz
RUN apt install build-essential -y
RUN apt install cmake -y
RUN apt install pkg-config -y
RUN apt install libsodium-dev -y
RUN apt install libunistring-dev -y

# Exporter
RUN apt install -y nodejs
RUN apt install -y npm

# Install ooz
WORKDIR /ooz
RUN git clone --depth=1 --recurse-submodules --shallow-submodules https://github.com/zao/ooz.git .
WORKDIR /ooz/build
# Set RPATH so liblibbun.so can load liblibooz.so
# https://github.com/zao/ooz/blob/dd51c6347f046fea3bd68fbab3485193575a85c2/bun_extract_file.cpp#L88
# https://github.com/zao/ooz/blob/dd51c6347f046fea3bd68fbab3485193575a85c2/bun.cpp#L117
RUN cmake .. -D CMAKE_BUILD_RPATH='$ORIGIN'
RUN cmake --build .
ENV PATH="${PATH}:/ooz/build"

# Install Exporter
COPY /dat2json /dat2json
WORKDIR /dat2json
RUN npm i
RUN npm run build
RUN npm i -g

WORKDIR /data