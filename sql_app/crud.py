from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy import func, and_


def get_country_records(db: Session, country: str):
    return db.query(models.Record).filter(models.Record.country == country).all()


def get_records(db: Session, skip: int = 0, param_count: int = 500, limit: int = 100):
    # return db.query(models.Record).filter(models.Record.param_count == param_count).order_by(models.Record.answer_count).offset(skip).limit(limit).all()
    # Subquery to get the minimum answer_count for each id
    subquery = (
        db.query(
            models.Record.id,
            func.min(models.Record.answer_count).label("min_answer_count"),
        )
        .filter(models.Record.param_count == param_count)
        .group_by(models.Record.id)
        .subquery()
    )

    # Join the subquery with the original table to get the full records
    records = (
        db.query(models.Record)
        .join(
            subquery,
            and_(
                models.Record.id == subquery.c.id,
                models.Record.answer_count == subquery.c.min_answer_count,
            ),
        )
        .order_by(models.Record.answer_count)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return records


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
