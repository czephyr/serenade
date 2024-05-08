from functools import wraps
from typing import Callable, TypeVar, ParamSpec
from fastapi import HTTPException, status
from sqlalchemy.exc import NoResultFound, IntegrityError

RESOURCE_NOT_FOUND = "Resource {_id} has not been found in {resource}"


class DuplicateCF(Exception):
    pass


class BadValues(ValueError):
    pass


P = ParamSpec("P")
T = TypeVar("T")


def unfoundable(resource: str, argloc: str | int = 1) -> Callable:
    def outer(foo: Callable[P, T]) -> Callable[P, T]:
        @wraps(foo)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            try:
                result = foo(*args, **kwargs)
            except (NoResultFound, IntegrityError) as excp:
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


def strictvalues():
    pass
