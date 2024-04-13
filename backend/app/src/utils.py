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
