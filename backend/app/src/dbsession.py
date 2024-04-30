import os

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker

url_object = URL.create(
    drivername="postgresql+psycopg",
    username=os.getenv("PGUSER"),
    password=os.getenv("PGPASSWORD"),
    host=os.getenv("PGHOST"),
    port=int(os.getenv("PGPORT", "5432")),
    database=os.getenv("PGDATABASE"),
)

engine = create_engine(url_object)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
