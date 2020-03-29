# Stubs for binascii

# Based on http://docs.python.org/3.2/library/binascii.html

import sys
from typing import Union, Text


if sys.version_info < (3,):
    # Python 2 accepts unicode ascii pretty much everywhere.
    _Bytes = Union[bytes, Text]
    _Ascii = Union[bytes, Text]
elif sys.version_info < (3, 3):
    # Python 3.2 and below only accepts bytes.
    _Bytes = bytes
    _Ascii = bytes
else:
    # But since Python 3.3 ASCII-only unicode strings are accepted by the
    # a2b_* functions.
    _Bytes = bytes
    _Ascii = Union[bytes, Text]

def a2b_uu(string: _Ascii) -> bytes: ...
if sys.version_info >= (3, 7):
    def b2a_uu(data: _Bytes, *, backtick: bool = ...) -> bytes: ...
else:
    def b2a_uu(data: _Bytes) -> bytes: ...
def a2b_base64(string: _Ascii) -> bytes: ...
if sys.version_info >= (3, 6):
    def b2a_base64(data: _Bytes, *, newline: bool = ...) -> bytes: ...
else:
    def b2a_base64(data: _Bytes) -> bytes: ...
def a2b_qp(string: _Ascii, header: bool = ...) -> bytes: ...
def b2a_qp(data: _Bytes, quotetabs: bool = ..., istext: bool = ...,
             header: bool = ...) -> bytes: ...
def a2b_hqx(string: _Ascii) -> bytes: ...
def rledecode_hqx(data: _Bytes) -> bytes: ...
def rlecode_hqx(data: _Bytes) -> bytes: ...
def b2a_hqx(data: _Bytes) -> bytes: ...
def crc_hqx(data: _Bytes, crc: int) -> int: ...
def crc32(data: _Bytes, crc: int = ...) -> int: ...
def b2a_hex(data: _Bytes) -> bytes: ...
def hexlify(data: _Bytes) -> bytes: ...
def a2b_hex(hexstr: _Ascii) -> bytes: ...
def unhexlify(hexlify: _Ascii) -> bytes: ...

class Error(Exception): ...
class Incomplete(Exception): ...
