from .commonSettings import *
import dj_database_url
import os

SECRET_KEY = os.environ["SECRET_KEY"]

DEBUG = False


ALLOWED_HOSTS = ["snapbuy.up.railway.app"]
CSRF_TRUSTED_ORIGINS = [
    'https://snapbuy.up.railway.app'
]

DATABASES = {"default": dj_database_url.config()}

REDIS_URL = os.environ["REDIS_URL"]

CELERY_BROKER_URL = REDIS_URL

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}



EMAIL_HOST = "localhost"
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_PORT = 8025
DEFAULT_EMAIL_FROM = "from@storefront.com"

