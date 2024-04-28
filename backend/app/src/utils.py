from datetime import date

from codicefiscale import codicefiscale


def to_age(cf: str) -> int:
    date_birth: date = codicefiscale.decode(cf)["birthdate"]
    date_today = date.today()
    age = (
        date_today.year
        - date_birth.year
        - ((date_today.month, date_today.day) < (date_birth.month, date_birth.day))
    )
    return age


def to_city(cf: str) -> str:
    birthplace: dict = codicefiscale.decode(cf)["birthplace"]
    result = "{name} ({province})".format(**birthplace)
    return result


from functools import wraps
from typing import Callable, TypeVar, ParamSpec
from fastapi import HTTPException, status
from sqlalchemy.exc import NoResultFound


from .core.excp import RESOURCE_NOT_FOUND

P = ParamSpec("P")
T = TypeVar("T")


def unfoundable(resource: str, argloc: str | int = 1) -> Callable:
    def outer(foo: Callable[P, T]) -> Callable[P, T]:
        @wraps(foo)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            try:
                result = foo(*args, **kwargs)
            except NoResultFound as excp:
                try:
                    _id = args[argloc] if isinstance(argloc, int) else kwargs[argloc]
                except:
                    _id = ""
                raise HTTPException(
                    status.HTTP_404_NOT_FOUND,
                    detail=RESOURCE_NOT_FOUND.format(_id=_id, resource=resource),
                ) from excp
            else:
                return result

        return wrapper

    return outer
