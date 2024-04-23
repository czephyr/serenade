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

# TODO meglio se rifatta con i `Protocol`

import inspect


def find_arg(func, arg_name):
    signature = inspect.signature(func)
    parameters = signature.parameters
    for i, (name, param) in enumerate(parameters.items()):
        if name == arg_name:
            return i
    return None


from functools import wraps
from functools import wraps
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec("P")
T = TypeVar("T")

from .roles import IIT


def maskable(func: Callable[P, T], role: str) -> Callable[P, T]:
    arg_name: str = "patient_id"
    role_name: str = IIT
    arg_idx = find_arg(func, arg_name)

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        if role != role_name:
            return func(*args, **kwargs)

        if arg_idx is not None:
            _id = kwargs.get(arg_name, args[arg_idx])
            if not isinstance(_id, int):
                raise TypeError(f"Expected {arg_name} to be an integer")

            kwargs[arg_name] = __CYPHER.decrypt(_id)

        result = func(*args, **kwargs)

        if hasattr(result, arg_name):
            setattr(result, arg_name, __CYPHER.encrypt(getattr(result, arg_name)))
        elif isinstance(result, list):
            for item in result:
                if hasattr(item, arg_name):
                    setattr(item, arg_name, __CYPHER.encrypt(getattr(item, arg_name)))

        return result

    return wrapper
