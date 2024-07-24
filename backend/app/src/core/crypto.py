import base64
import os
from functools import wraps
from typing import Callable, ParamSpec, TypeVar

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from fastapi import HTTPException, status

from .excp import RESOURCE_NOT_FOUND
from .roles import IIT

HUE_BYTE_SIZE = int(os.getenv("HUE_BYTE_SIZE", 6))
__F = Fernet(os.getenv("FERNET_KEY", Fernet.generate_key()))

P = ParamSpec("P")
T = TypeVar("T")


# TODO molto meglio se rifatta con i `Protocol`
def maskable(func: Callable[P, T], role: str) -> Callable[P, T]:
    """Restituisce una funzione decorata che decifra il parametro specificato in `arg_name` se l'utente ha il ruolo specificato in `role_name`.

    Parameters
    ----------
    `func` : `Callable[P, T]`
        La funzione da decorare, che accetta un parametro `arg_name`.
    `role` : `str`
        Il ruolo dell'utente che attiva il processo di mascheratura.

    Returns
    -------
    `Callable[P, T]`
        La funzione decorata, se l'utente ha il ruolo uguale al valore di `role_name`, altrimenti `func` (la stessa funzione in input).

    Raises
    ------
    `HTTPException`
        `HTTP_404_NOT_FOUND` se il valore del parametro `arg_name` non è valido.
    """
    arg_name: str = "patient_id"
    role_name: str = IIT

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:

        # Se l'utente non ha il ruolo specificato, esgui la funzione senza modifiche
        if role != role_name:
            return func(*args, **kwargs)

        # estrai il valore del parametro `arg_name``
        if arg_name in kwargs:
            _id = str(kwargs[arg_name])
            _id = _id.encode()

            # decifra il valore del parametro `arg_name`
            try:
                _id = __F.decrypt(_id)
            except InvalidToken:
                _id = _id.decode()
                raise HTTPException(
                    status.HTTP_404_NOT_FOUND,
                    detail=RESOURCE_NOT_FOUND.format(_id=_id, resource="patient"),
                )
            # _id = base64.urlsafe_b64encode(_id) # padding alternativo

            _id = _id.decode()
            kwargs[arg_name] = _id

        # esegui la funzione con il parametro decifrato
        result = func(*args, **kwargs)

        # cifra il valore del parametro `arg_name`
        if hasattr(result, arg_name):
            _id = str(getattr(result, arg_name))
            _id = _id.encode()

            # _id = base64.urlsafe_b64decode(_id) # padding alternativo
            _id = __F.encrypt(_id)

            _id = _id.decode()
            setattr(result, arg_name, _id)

        # cifra il valore del parametro `arg_name` in tutti gli oggetti di una lista
        elif isinstance(result, list):
            for item in result:
                if hasattr(item, arg_name):
                    _id = str(getattr(item, arg_name))
                    _id = _id.encode()

                    # _id = base64.urlsafe_b64decode(_id) # padding alternativo
                    _id = __F.encrypt(_id)

                    _id = _id.decode()
                    setattr(item, arg_name, _id)

        return result

    return wrapper


def draw(size=24) -> str:
    """
    Genera un `patient_id` (e in generale un valore) casuale di `size` bit.

    Parameters
    ----------
    `size` : `int`, optional
        numero di bit, by default `24`

    Returns
    -------
    `str`
        Il valore estratto, formattato in base64
    """
    assert not size % 3
    rbytes = os.urandom(size)

    rbytes = base64.urlsafe_b64encode(rbytes)
    result = rbytes.decode()
    return result


def hue(value: str, max_size=HUE_BYTE_SIZE) -> int:
    """
    Hashing di `value` con dimenstione arbitraria `max_size`

    Parameters
    ----------
    `value` : `str`
        Valore di chi calcolare l'hashing
    `max_size` : `_type_`, optional
        Dimensione massima dell'hashing espressa in bit, by default `HUE_BYTE_SIZE`

    Returns
    -------
    `int`
        Valore dell'hashing, espresso in integer
    """
    digest = hashes.Hash(hashes.SHAKE128(max_size))
    digest.update(value.encode())
    rbytes = digest.finalize()

    result = int.from_bytes(rbytes, byteorder="big")
    return result
