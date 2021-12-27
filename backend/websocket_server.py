#!/usr/bin/env python


import asyncio
import websockets
from websockets.exceptions import ConnectionClosedOK
import json
import argparse
import os
import subprocess
import re

from loader import handler_registry


from time import sleep

event = asyncio.Event()
loop = asyncio.get_event_loop()


async def ws_handler(websocket, path):
    while(True):
        try:
            data = await websocket.recv()
            data = json.loads(data)

            for msg_type in data.keys():
                if msg_type not in handler_registry.message_handler_funcs.keys():
                    print(f"Unknown message type: {msg_type}")
                    continue
                print (f"WS: {msg_type}")
                result = handler_registry.message_handler_funcs[msg_type](data[msg_type])
                if result is not None:
                    await websocket.send(json.dumps(result))

        except ConnectionClosedOK:
            pass




if __name__ == "__main__":

    # load message handlers
    handler_registry.load_handler_modules(['handlers.h264_handler'])

    start_server = websockets.serve(ws_handler, port=8001)
    loop.run_until_complete(start_server)
    loop.run_forever()