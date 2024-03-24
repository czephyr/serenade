from codicefiscale import codicefiscale
from datetime import datetime


# https://github.com/fabiocaccamo/python-codicefiscale
def to_age(cf: str):
    return (datetime.now() - codicefiscale.decode(cf)["birthdate"]).days
