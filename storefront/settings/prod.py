import os

import dj_database_url

from storefront.settings.common import *

DEBUG = False

SECRET_KEY = os.environ["SECRET_KEY"]

ALLOWED_HOSTS = [
    "snapbuy.up.railway.app",
    "0.0.0.0",
    "localhost",
]
CSRF_TRUSTED_ORIGINS = ["https://snapbuy.up.railway.app"]

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


EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_PORT = os.environ.get("EMAIL_PORT", 587)
