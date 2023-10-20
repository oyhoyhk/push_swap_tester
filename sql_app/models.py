from sqlalchemy import Column, String, Integer
from .sqlite_base import *

class Record(Base):
  __tablename__ = 'records'

  id = Column(String, primary_key=True)
  country = Column(String, index=True)
  param_count = Column(Integer)
  answer_count = Column(Integer)
  def __init__(self, id, country, param_count, answer_count):
    self.id = id
    self.country = country
    self.param_count = param_count
    self.answer_count = answer_count

# class Log(Base):
#   __tablename__ = 'logs'

#   id = Column(String, index=True)
#   country = Column(String, index=True)
#   repo = Column(String, index=True)
#   params_3 = Column(Integer)
#   params_5 = Column(Integer)
#   params_100 = Column(Integer)
  # params_500 = Column(Integer)

init_db()