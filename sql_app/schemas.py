from pydantic import BaseModel

class RecordBase(BaseModel):
  id:str
  country:str
  answer_count:int

class RecordCreate(RecordBase):
  pass

class Record(RecordBase):
  class Config:
    orm_mode = True

class LogBase(BaseModel):
  id:str
  country:str
  repo:str
  answer_count:int

class LogCreate(LogBase):
  pass

class Log(LogBase):
  class Config:
    orm_mode = True
