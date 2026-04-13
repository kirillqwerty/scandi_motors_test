from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

ADMIN_TOKEN = "autominsk_admin_2024"

# Models
class Car(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand: str
    model: str
    year: int
    price: int
    mileage: int = 0
    engine: str = ""
    transmission: str = ""
    fuel_type: str = ""
    body_type: str = ""
    color: str = ""
    drive_type: str = ""
    power: str = ""
    image_url: str = ""
    images: List[str] = []
    description: str = ""
    is_from_europe: bool = False
    is_commission: bool = False
    status: str = "available"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    price: int
    mileage: int = 0
    engine: str = ""
    transmission: str = ""
    fuel_type: str = ""
    body_type: str = ""
    color: str = ""
    drive_type: str = ""
    power: str = ""
    image_url: str = ""
    images: List[str] = []
    description: str = ""
    is_from_europe: bool = False
    is_commission: bool = False
    status: str = "available"

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[int] = None
    mileage: Optional[int] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    drive_type: Optional[str] = None
    power: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    is_from_europe: Optional[bool] = None
    is_commission: Optional[bool] = None
    status: Optional[str] = None

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str = ""
    content: str
    excerpt: str = ""
    image_url: str = ""
    published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ArticleCreate(BaseModel):
    title: str
    content: str
    excerpt: str = ""
    image_url: str = ""
    published: bool = True

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    published: Optional[bool] = None

class Submission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    message: str = ""
    service_type: str = "general"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_read: bool = False

class SubmissionCreate(BaseModel):
    name: str
    phone: str
    message: str = ""
    service_type: str = "general"

class AdminLogin(BaseModel):
    password: str

def make_slug(title):
    import re
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug[:80]

# Auth helper
async def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials.credentials

# Admin auth
@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    if data.password == "autominsk2024":
        return {"token": ADMIN_TOKEN, "message": "Success"}
    raise HTTPException(status_code=401, detail="Invalid password")

# Cars
@api_router.get("/cars", response_model=List[Car])
async def get_cars():
    cars = await db.cars.find({}, {"_id": 0}).to_list(100)
    return cars

@api_router.get("/cars/{car_id}", response_model=Car)
async def get_car(car_id: str):
    car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@api_router.post("/cars", response_model=Car)
async def create_car(data: CarCreate, token: str = Depends(verify_admin)):
    car = Car(**data.model_dump())
    doc = car.model_dump()
    await db.cars.insert_one(doc)
    return car

@api_router.put("/cars/{car_id}", response_model=Car)
async def update_car(car_id: str, data: CarUpdate, token: str = Depends(verify_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.cars.update_one({"id": car_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    return car

@api_router.delete("/cars/{car_id}")
async def delete_car(car_id: str, token: str = Depends(verify_admin)):
    result = await db.cars.delete_one({"id": car_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted"}

# Articles
@api_router.get("/articles", response_model=List[Article])
async def get_articles(all: bool = False):
    query = {} if all else {"published": True}
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return articles

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@api_router.post("/articles", response_model=Article)
async def create_article(data: ArticleCreate, token: str = Depends(verify_admin)):
    article = Article(**data.model_dump())
    article.slug = make_slug(data.title)
    doc = article.model_dump()
    await db.articles.insert_one(doc)
    return article

@api_router.put("/articles/{article_id}", response_model=Article)
async def update_article(article_id: str, data: ArticleUpdate, token: str = Depends(verify_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    if "title" in update_data:
        update_data["slug"] = make_slug(update_data["title"])
    result = await db.articles.update_one({"id": article_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    return article

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str, token: str = Depends(verify_admin)):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Deleted"}

# Submissions
@api_router.post("/submissions", response_model=Submission)
async def create_submission(data: SubmissionCreate):
    submission = Submission(**data.model_dump())
    doc = submission.model_dump()
    await db.submissions.insert_one(doc)
    return submission

@api_router.get("/submissions", response_model=List[Submission])
async def get_submissions(token: str = Depends(verify_admin)):
    subs = await db.submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return subs

@api_router.delete("/submissions/{sub_id}")
async def delete_submission(sub_id: str, token: str = Depends(verify_admin)):
    result = await db.submissions.delete_one({"id": sub_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Deleted"}

@api_router.put("/submissions/{sub_id}/read")
async def mark_submission_read(sub_id: str, token: str = Depends(verify_admin)):
    await db.submissions.update_one({"id": sub_id}, {"$set": {"is_read": True}})
    return {"message": "Marked as read"}

# Seed
@api_router.post("/seed")
async def seed_data():
    count = await db.cars.count_documents({})
    if count > 0:
        return {"message": "Data already seeded"}
    cars = [
        {
            "id": str(uuid.uuid4()), "brand": "BMW", "model": "X5 xDrive40i", "year": 2023,
            "price": 78500, "mileage": 12000, "engine": "3.0L Turbo I6", "transmission": "Автомат",
            "fuel_type": "Бензин", "body_type": "Внедорожник", "color": "Чёрный", "drive_type": "Полный",
            "power": "340 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1760713170685-b67abc3be5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc1ODIwNTQ3fDA&ixlib=rb-4.1.0&q=85",
            "description": "Премиальный внедорожник в идеальном состоянии. Полная комплектация M Sport. Адаптивная подвеска, панорамная крыша, проекционный дисплей.",
            "is_from_europe": True, "is_commission": False, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "brand": "Mercedes-Benz", "model": "S-Class W223", "year": 2024,
            "price": 125000, "mileage": 5000, "engine": "3.0L Turbo I6 + EQ Boost", "transmission": "Автомат",
            "fuel_type": "Бензин", "body_type": "Седан", "color": "Серебристый", "drive_type": "Полный",
            "power": "435 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1745944190163-c500fc005c38?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwyfHxzdGVlcmluZyUyMHdoZWVsJTIwbHV4dXJ5JTIwY2FyJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc1ODIwNTU4fDA&ixlib=rb-4.1.0&q=85",
            "description": "Флагманский седан. Burmester 4D. Массаж. Ночное видение. MBUX с AI.",
            "is_from_europe": True, "is_commission": False, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "brand": "Porsche", "model": "911 Carrera S", "year": 2023,
            "price": 145000, "mileage": 8500, "engine": "3.0L Twin-Turbo Flat-6", "transmission": "PDK",
            "fuel_type": "Бензин", "body_type": "Купе", "color": "Красный", "drive_type": "Задний",
            "power": "450 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1759166499946-9ab9e7776d41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc1ODIwNTQ3fDA&ixlib=rb-4.1.0&q=85",
            "description": "Легендарный спорткар. Sport Chrono. PASM. Спортивный выхлоп. Керамические тормоза.",
            "is_from_europe": True, "is_commission": False, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "brand": "Audi", "model": "Q8 55 TFSI", "year": 2023,
            "price": 92000, "mileage": 15000, "engine": "3.0L TFSI V6", "transmission": "Tiptronic",
            "fuel_type": "Бензин", "body_type": "Внедорожник", "color": "Синий", "drive_type": "Полный",
            "power": "340 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1760713164476-7eb5063b3d07?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc1ODIwNTQ3fDA&ixlib=rb-4.1.0&q=85",
            "description": "Купе-кроссовер S-Line. Matrix LED. Панорама. Air Suspension.",
            "is_from_europe": False, "is_commission": True, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "brand": "Volkswagen", "model": "Touareg R-Line", "year": 2022,
            "price": 62000, "mileage": 28000, "engine": "3.0L TDI V6", "transmission": "Автомат",
            "fuel_type": "Дизель", "body_type": "Внедорожник", "color": "Белый", "drive_type": "Полный",
            "power": "286 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1763405919443-1ef37159e0ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjYXIlMjBkcml2aW5nJTIwZXVyb3BlYW4lMjBhbHBzfGVufDB8fHx8MTc3NTgyMDU0N3ww&ixlib=rb-4.1.0&q=85",
            "description": "Полный привод 4Motion. Пневмоподвеска. IQ.Light. Head-Up Display.",
            "is_from_europe": True, "is_commission": False, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "brand": "Land Rover", "model": "Range Rover Sport", "year": 2023,
            "price": 115000, "mileage": 9000, "engine": "3.0L P400 I6", "transmission": "Автомат",
            "fuel_type": "Бензин", "body_type": "Внедорожник", "color": "Зелёный", "drive_type": "Полный",
            "power": "400 л.с.", "images": [],
            "image_url": "https://images.unsplash.com/photo-1770064747916-1efbb1973ec7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxzdGVlcmluZyUyMHdoZWVsJTIwbHV4dXJ5JTIwY2FyJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc1ODIwNTU4fDA&ixlib=rb-4.1.0&q=85",
            "description": "Dynamic SE. Terrain Response 2. Meridian Surround Sound.",
            "is_from_europe": False, "is_commission": True, "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.cars.insert_many(cars)

    # Seed articles
    art_count = await db.articles.count_documents({})
    if art_count == 0:
        articles = [
            {
                "id": str(uuid.uuid4()), "title": "Как правильно выбрать автомобиль из Европы",
                "slug": "kak-pravilno-vybrat-avtomobil-iz-evropy",
                "content": "При выборе автомобиля из Европы важно учитывать несколько ключевых факторов. Во-первых, проверьте историю обслуживания — европейские дилеры ведут подробную историю каждого автомобиля. Во-вторых, обратите внимание на пробег и год выпуска. Средний пробег в Европе составляет 15-20 тыс. км в год.\n\nТакже важно учесть стоимость растаможки и логистики. Мы в Scandi Motors берём все эти расходы на себя и предоставляем прозрачный расчёт стоимости.\n\nОсновные площадки для поиска автомобилей в Европе: Mobile.de (Германия), AutoScout24 (вся Европа), Autovit (Польша). Мы работаем со всеми крупными площадками и аукционами.",
                "excerpt": "Ключевые советы по выбору и покупке автомобиля из Европы — на что обращать внимание, какие документы проверять.",
                "image_url": "https://images.unsplash.com/photo-1763405919443-1ef37159e0ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjYXIlMjBkcml2aW5nJTIwZXVyb3BlYW4lMjBhbHBzfGVufDB8fHx8MTc3NTgyMDU0N3ww&ixlib=rb-4.1.0&q=85",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()), "title": "Преимущества покупки авто в лизинг",
                "slug": "preimushchestva-pokupki-avto-v-lizing",
                "content": "Лизинг автомобиля — это удобный способ приобретения транспортного средства без значительных первоначальных затрат. В отличие от кредита, лизинг позволяет использовать автомобиль, выплачивая ежемесячные платежи, и в конце срока договора выкупить его по остаточной стоимости.\n\nОсновные преимущества лизинга:\n- Минимальный первоначальный взнос от 10%\n- Фиксированные ежемесячные платежи\n- Возможность обновлять автомобиль каждые 2-3 года\n- Налоговые преимущества для юридических лиц\n\nМы сотрудничаем с ведущими лизинговыми компаниями Беларуси и поможем подобрать оптимальные условия.",
                "excerpt": "Узнайте о преимуществах лизинга автомобилей для физических и юридических лиц.",
                "image_url": "https://images.unsplash.com/photo-1760713170685-b67abc3be5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc1ODIwNTQ3fDA&ixlib=rb-4.1.0&q=85",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.articles.insert_many(articles)

    return {"message": f"Seeded {len(cars)} cars and articles"}

# Health
@api_router.get("/")
async def root():
    return {"message": "Scandi Motors API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
