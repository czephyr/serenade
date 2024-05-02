import base64
import os
from functools import wraps
from typing import Callable, ParamSpec, TypeVar

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes

from .roles import IIT

HUE_SIZE = int(os.getenv("HUE_SIZE", 25))
__F = Fernet(os.getenv("FERNET_KEY", Fernet.generate_key()))

P = ParamSpec("P")
T = TypeVar("T")


# TODO molto meglio se rifatta con i `Protocol`
def maskable(func: Callable[P, T], role: str) -> Callable[P, T]:
    arg_name: str = "patient_id"
    role_name: str = IIT

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        if role != role_name:
            return func(*args, **kwargs)

        if arg_name in kwargs:
            _id = str(kwargs[arg_name])
            _id = _id.encode()

            _id = __F.decrypt(_id)
            # _id = base64.urlsafe_b64encode(_id)

            _id = _id.decode()
            kwargs[arg_name] = _id

        result = func(*args, **kwargs)

        if hasattr(result, arg_name):
            _id = str(getattr(result, arg_name))
            _id = _id.encode()

            # _id = base64.urlsafe_b64decode(_id)
            _id = __F.encrypt(_id)

            _id = _id.decode()
            setattr(result, arg_name, _id)
        elif isinstance(result, list):
            for item in result:
                if hasattr(item, arg_name):
                    _id = str(getattr(item, arg_name))
                    _id = _id.encode()

                    # _id = base64.urlsafe_b64decode(_id)
                    _id = __F.encrypt(_id)

                    _id = _id.decode()
                    setattr(item, arg_name, _id)

        return result

    return wrapper


def draw(size=24) -> str:
    assert not size % 3
    rbytes = os.urandom(size)

    rbytes = base64.urlsafe_b64encode(rbytes)
    result = rbytes.decode()
    return result


def hue(value: str, max_size=HUE_SIZE) -> int:
    digest = hashes.Hash(hashes.SHAKE128(max_size))
    digest.update(value.encode())
    rbytes = digest.finalize()

    result = int.from_bytes(rbytes, byteorder="big")
    return result
