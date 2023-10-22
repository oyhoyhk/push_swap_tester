from sqlalchemy import Column, String, Integer
from .sqlite_base import *


class Record(Base):
    __tablename__ = "records"

    unique_id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String)
    country = Column(String, index=True)
    param_count = Column(Integer)
    answer_count = Column(Integer)


class Log(Base):
    __tablename__ = "logs"

    unique_id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, index=True)
    country = Column(String, index=True)
    repo = Column(String, index=True)
    answer_count = Column(Integer)
    params_3 = Column(Integer, index=True)
    params_5 = Column(Integer, index=True)
    params_100 = Column(Integer, index=True)
    params_500 = Column(Integer, index=True)
