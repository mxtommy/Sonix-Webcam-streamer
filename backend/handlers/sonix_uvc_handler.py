import subprocess


from websocket_server import handler_registry

device = '/dev/video2'


def initialize():
    handler_registry.register('set_bitrate_kbps', set_bitrate)
    handler_registry.register('set_v4l2_ctrl', set_v4l1_ctrl)
    initial_feed_setup()    




def set_bitrate(bitrate):
    bitrate_bps = str(bitrate * 1000)
    cmd_array = ['/usr/local/bin/SONiX_UVC_TestAP', '--xuset-br', bitrate_bps, device]
    print(" ".join(cmd_array))
    subprocess.Popen(cmd_array)



def set_v4l1_ctrl(message):
    control_name = message.get('control_name')
    value = message.get('value')
    if control_name is None or value is None:
        print("Missing control or value")
        return # better then crashing...
    cmd_array = ['/usr/bin/v4l2-ctl', '--device', device, '--set-ctrl', f"{control_name}={value}"]
    print(" ".join(cmd_array))
    subprocess.Popen(cmd_array)


def initial_feed_setup():
    set_bitrate(300)


