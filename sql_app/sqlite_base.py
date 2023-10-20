from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("sqlite:///sql_app.db", echo=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

# 오류발생시 sqlite 홈페이지에 들어가서 자기환경에 맡는 bit (내기준 64bit) dll download해서
# anaconda3\envs\프로젝트\Dlls 폴더에 넣어준다.
# https://www.sqlite.org/index.html


def init_db():
    Base.metadata.create_all(bind=engine)