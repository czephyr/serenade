import os

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker

# TODO remove default values and raise ImportError
url_object = URL.create(
    drivername="postgresql+psycopg",
    username=os.environ["PGUSER"],
    password=os.environ["PGPASSWORD"],
    host=os.environ["PGHOST"],
    port=int(os.environ["PGPORT"]),
    database=os.environ["PGDATABASE"],
)

engine = create_engine(url_object)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
