FROM ghcr.io/zephyrproject-rtos/zephyr-build:latest

USER root

RUN apt-get update 
RUN apt-get install -y \
    net-tools \
    uml-utilities \
    bridge-utils \
    nftables

RUN apt-get install -y qemu-system-x86
RUN apt-get install -y iputils-ping curl
RUN apt-get install -y --no-install-recommends git cmake ninja-build gperf \
    ccache dfu-util device-tree-compiler wget \
    python3-dev python3-pip python3-setuptools python3-tk python3-wheel xz-utils file \
    make gcc gcc-multilib g++-multilib libsdl2-dev libmagic1


RUN west init -m https://github.com/zephyrproject-rtos/zephyr --mr main . 
RUN west update 
RUN west zephyr-export

RUN cd /workdir/tools/net-tools && make

RUN apt-get install -y avahi-daemon

RUN apt-get install -y nano

COPY docker/services.sh /services.sh
RUN chmod +x /services.sh

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY gateway-http-server-redis /gateway-http-server-redis
RUN cd /gateway-http-server-redis && bun install

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD ["/services.sh"]

EXPOSE 8000

USER root 