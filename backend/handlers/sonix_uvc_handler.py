import subprocess


from websocket_server import handler_registry

device = '/dev/video2'


def initialize():
    handler_registry.register('set_bitrate_kbps', set_bitrate)
    initial_feed_setup()    




def set_bitrate(bitrate):
    bitrate_bps = str(bitrate * 1000)
    cmd_array = ['/usr/local/bin/SONiX_UVC_TestAP', '--xuset-br', bitrate_bps, device]
    print(" ".join(cmd_array))
    subprocess.Popen(cmd_array)



def initial_feed_setup():
    set_bitrate(300)