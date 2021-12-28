# Sonix-Webcam-streamer

Stream Sonix H264 USB Camera over webRTC.

Based heavily on https://github.com/husarnet/webrtc-streamer, but I had no need for VPN stuff, or dockerm, and needed control of bitrate/exposure/gain/etc.

ffmpeg streams to janus server on same machine. nginx serves angular webapp which connects back to janus


