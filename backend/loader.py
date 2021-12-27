from __future__ import annotations 
import importlib
from typing import Any, Callable


class MessageHandlerInterface:
    @staticmethod
    def initialize() -> None:
        """ register message handlers """


class MessageHandlerRegistry:
    message_handler_funcs: dict[str, Callable[[Any], None]] = {}



    def import_module(self, name: str) -> MessageHandlerInterface:
        return importlib.import_module(name)   

    def load_handler_modules(self, mods: list[str]) -> None:
        for mod_name in mods:
            mod = self.import_module(mod_name)
            mod.initialize()


    def register(self, message_type: str, func: Callable[[Any], None]):
        """ Register function which will handle message_type messages """
        self.message_handler_funcs[message_type] = func


handler_registry = MessageHandlerRegistry()