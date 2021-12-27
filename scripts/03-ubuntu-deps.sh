#!/bin/bash

apt-get install libssl-dev

# Install libsrtp
cd ~ && \
git clone https://github.com/cisco/libsrtp.git && \
cd libsrtp && \
git checkout v2.2.0 && \
./configure --prefix=/usr --enable-openssl && \
make shared_library && \
sudo make install

rm /lib/x86_64-linux-gnu/libsrtp2.so.1 && ln -s /usr/lib/libsrtp2.so.1 /lib/x86_64-linux-gnu/libsrtp2.so.1

#mdns
apt-get install avahi-daemon avahi-discover
