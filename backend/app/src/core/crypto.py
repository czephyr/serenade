import os


class Euler:
    def __init__(self, N: int, e: int) -> None:
        """Create a Euler cypher object

        Args:
            N (int): module base, must be a prime number
            e (int): traslation key, should be prime or at least coprime with (N-1)
        """
        self.N = N
        self.__E = e
        self.__D = pow(e, -1, N - 1)

    def encrypt(self, value: int) -> int:
        return pow(value, self.__E, self.N)

    def decrypt(self, value: int) -> int:
        return pow(value, self.__D, self.N)


__BASE_KEY = int(os.environ.get("EULER_BASE_KEY", 2**64))
__SECRET_KEY = int(os.environ.get("EULER_SECRET_KEY", 1))
__CYPHER = Euler(__BASE_KEY, __SECRET_KEY)

from functools import wraps
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec("P")
T = TypeVar("T")

from .roles import IIT
from cryptography.hazmat.primitives import hashes

HUE_SIZE = int(os.getenv("HUE_SIZE", 25))


# TODO molto meglio se rifatta con i `Protocol`
def maskable(func: Callable[P, T], role: str) -> Callable[P, T]:
    arg_name: str = "patient_id"
    role_name: str = IIT

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        if role != role_name:
            return func(*args, **kwargs)

        if arg_name in kwargs:
            _id = kwargs[arg_name]
            if not isinstance(_id, int):
                raise TypeError(f"Expected {arg_name} to be an integer")
            _id = __CYPHER.decrypt(_id)
            kwargs[arg_name] = _id

        result = func(*args, **kwargs)

        if hasattr(result, arg_name):
            setattr(result, arg_name, __CYPHER.encrypt(getattr(result, arg_name)))
        elif isinstance(result, list):
            for item in result:
                if hasattr(item, arg_name):
                    setattr(item, arg_name, __CYPHER.encrypt(getattr(item, arg_name)))

        return result

    return wrapper


def hue(value: str, max_size=HUE_SIZE) -> int:
    digest = hashes.Hash(hashes.SHAKE128(max_size))
    digest.update(value.encode())
    rbytes = digest.finalize()

    result = int.from_bytes(rbytes, byteorder="big")
    return result
