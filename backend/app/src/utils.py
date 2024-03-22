from codicefiscale import codicefiscale
from datetime import datetime


# https://github.com/fabiocaccamo/python-codicefiscale
def age_from_cf(cf: str):
    return (datetime.now() - codicefiscale.decode(cf)["birthdate"]).days
