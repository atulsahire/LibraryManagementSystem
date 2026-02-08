from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Type, Any
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .database import get_db, Base
from . import models, schemas, crud

app = FastAPI(title="Library Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated Factory with 'update' support
def create_crud_router(
    model: Type[Base],
    schema: Type[BaseModel],
    create_schema: Type[BaseModel],
    update_schema: Type[BaseModel],  # New parameter for update validation
    prefix: str,
    tags: List[str]
):
    router = APIRouter(prefix=prefix, tags=tags)
    repo = crud.CRUDBase(model)

    @router.get("/", response_model=List[schema])
    def read_all(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
        return repo.get_multi(db, skip=skip, limit=limit)

    @router.get("/{id}", response_model=schema)
    def read_one(id: int, db: Session = Depends(get_db)):
        item = repo.get(db, id=id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item

    @router.post("/", response_model=schema)
    def create(obj_in: create_schema, db: Session = Depends(get_db)):
        print("in post")
        return repo.create(db, obj_in=obj_in)

    # --- NEW UPDATE OPERATION ---
    @router.put("/{id}", response_model=schema)
    def update(id: int, obj_in: update_schema, db: Session = Depends(get_db)):
        db_obj = repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Item not found")
        return repo.update(db, db_obj=db_obj, obj_in=obj_in)

    @router.delete("/{id}")
    def delete(id: int, db: Session = Depends(get_db)):
        item = repo.remove(db, id=id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"status": "deleted", "id": id}

    return router

# Register routers for all your entities
app.include_router(create_crud_router(models.Book, schemas.Book, schemas.BookCreate, schemas.BookUpdate, "/books", ["Books"]))
app.include_router(create_crud_router(models.Member, schemas.Member, schemas.MemberCreate, schemas.MemberUpdate, "/members", ["Members"]))
app.include_router(create_crud_router(models.Lending, schemas.Lending, schemas.LendingCreate, schemas.LendingUpdate, "/lendings", ["Lendings"]))
app.include_router(create_crud_router(models.Fine, schemas.Fine, schemas.FineCreate, schemas.FineUpdate, "/fines", ["Fines"]))
app.include_router(create_crud_router(models.Reservation, schemas.Reservation, schemas.ReservationCreate, schemas.ReservationUpdate, "/reservations", ["Reservations"]))
app.include_router(create_crud_router(models.Notification, schemas.Notification, schemas.NotificationCreate, schemas.NotificationUpdate, "/notifications", ["Notifications"]))

