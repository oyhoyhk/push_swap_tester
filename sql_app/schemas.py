from pydantic import BaseModel


class RecordBase(BaseModel):
    id: str
    country: str
    param_count: int
    answer_count: int


class RecordCreate(RecordBase):
    pass


class Record(RecordBase):
    unique_id: int

    class Config:
        orm_mode = True


class LogBase(BaseModel):
    id: str
    country: str
    repo: str
    answer_count: int
    params_3: int
    params_5: int
    params_100: int
    params_500: int


class LogCreate(LogBase):
    id: str
    country: str
    repo: str
    answer_count: int
    params_3: int
    params_5: int
    params_100: int
    params_500: int


class Log(LogBase):
    class Config:
        orm_mode = True
