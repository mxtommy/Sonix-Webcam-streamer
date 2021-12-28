import subprocess
import re
from time import sleep

from websocket_server import handler_registry

device = '/dev/video2'


def initialize():
    handler_registry.register('get_feed_options', get_feed_options_supported)
    handler_registry.register('set_resolution_fps', update_feed_resolution_fps)
    initial_feed_setup("320x240","30.000")    

    


def check_if_webcam_outputs_h264_feed():
    result = subprocess.run(['v4l2-ctl', '-d', device, '--list-formats-ext', ],capture_output=True,text=True)
    to_find = "(H.264, compressed)"
    index = result.stdout.find(to_find)
    if index==-1:
        return False
    return True


def kill_ffmpeg():
    try:
        res =  str(subprocess.check_output(["pidof","ffmpeg"]))
        pids = re.findall(r'\d+', res)
        print("Killing FFMPEG")
        print(pids)
        for pid in pids:
            print("killed:"+pid)
            subprocess.run(["kill",pid])

    except subprocess.CalledProcessError as e:
        print("Error killing ffmpeg!")


def run_ffmpeg_h264(size, fps):
    cmd_array = ['ffmpeg', '-f', 'v4l2', '-framerate', fps, '-video_size', size, '-codec:v', 'h264', '-i', device, '-an', '-c:v', 'copy', '-f', 'rtp', 'rtp://localhost:8005' ]
    print(" ".join(cmd_array))
    subprocess.Popen(cmd_array)


def run_ffmpeg_audio(card_num):
    # more about '-ac' options: https://trac.ffmpeg.org/wiki/AudioChannelManipulation
    # all ffmpeg flags: https://gist.github.com/tayvano/6e2d456a9897f55025e25035478a3a50
    # good article about ALSA: https://trac.ffmpeg.org/wiki/Capture/ALSA 
    subprocess.Popen(['ffmpeg',  '-f', 'alsa', '-ac', '1', '-i', 'hw:'+card_num, '-acodec', 'libopus', '-ab', '16k',  '-f', 'rtp', 'rtp://localhost:8007'])
 

def get_audiocard_id():
    result = subprocess.run([ 'arecord', '-l'],capture_output=True,text=True)
    match = re.search('card ([0-9]).*264', result.stdout)
    if match:
        return match.group(1)
    else:
        ValueError("Could not find AudioCard ID")


def get_feed_options_supported(message):
    result = subprocess.run(['v4l2-ctl', '-d', device, '--list-formats-ext', ],capture_output=True,text=True)
    parsed = {"feed_options":{}}
    current_size = None

    for line in result.stdout.split("\n"):

        #search for size
        match = re.search("Size: Discrete (.*)", line)
        if match:
            current_size = match.group(1)
            parsed["feed_options"][current_size] = []
            continue

        #search for fps
        match = re.search("Interval: Discrete .*\((.*)(\.[0-9]+) fps\)", line)
        if match:
            if match.group(1) not in parsed["feed_options"][current_size]:
                parsed["feed_options"][current_size].append(match.group(1))

                
    return parsed


def update_feed_resolution_fps(message):
    new_resolution = message.get('resolution', '320x240')
    new_fps = message.get('fps', '30')
    kill_ffmpeg()
    sleep(2)
    run_ffmpeg_h264(new_resolution,new_fps)
    #run_ffmpeg_audio(audio_card_id)


def initial_feed_setup(size,fps):
    run_ffmpeg_h264(size,fps)
    #run_ffmpeg_audio(get_audiocard_id())



if __name__ == "__main__":
    print(get_feed_options_supported())