#!/bin/bash


apt-get install nginx
rm -R /var/www/html/*
cp -a ../frontend/dist/* /var/www/html/
