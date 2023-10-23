from sqlalchemy.orm import Session
from . import models, schemas


def get_country_records(db: Session, country: str):
    return db.query(models.Record).filter(models.Record.country == country).all()


def get_records(db: Session, skip: int = 0, param_count : int = 500, limit: int = 100):
    return db.query(models.Record).filter(models.Record.param_count == param_count).order_by(models.Record.answer_count).offset(skip).limit(limit).all()


def create_record(db: Session, record: schemas.RecordCreate):
    db_record = models.Record(
        id=record.id,
        country=record.country,
        param_count=record.param_count,
        answer_count=record.answer_count,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def creaet_log(db: Session, log: schemas.LogCreate):
    db_log = models.Log(
        id=log.id, country=log.country, repo=log.repo, answer_count=log.answer_count
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
