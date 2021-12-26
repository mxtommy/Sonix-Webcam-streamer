#!/bin/bash

cd ~
mkdir C1_SONIX
cd C1_SONIX
wget https://github.com/Kurokesu/C1_SONIX_Test_AP/archive/refs/heads/master.zip
unzip master.zip
cd C1_SONIX_Test_AP-master
make
cp SONiX_UVC_TestAP /usr/local/bin/

