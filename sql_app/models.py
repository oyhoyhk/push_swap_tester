from sqlalchemy import Column, String, Integer

from .database import Base

class Record(Base):
  __tablename__ = 'records'

  id = Column(String, primary_key=True)
  country = Column(String, index=True)
  answer_count = Column(Integer)

class Log(Base):
  __tablename__ = 'logs'

  id = Column(String, index=True)
  country = Column(String, index=True)
  repo = Column(String, index=True)
  answer_count = Column(Integer)