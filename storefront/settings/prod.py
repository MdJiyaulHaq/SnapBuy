import os

import dj_database_url

from storefront.settings.common import *

DEBUG = False

SECRET_KEY = os.environ["SECRET_KEY"]

ALLOWED_HOSTS = [
    "snapbuy-0zkz.onrender.com",
    ".onrender.com",
]

DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///db.sqlite3",  # Fallback to SQLite during build
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=False,  # Will be overridden by DATABASE_URL in production
    )
}

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

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


CORS_ALLOWED_ORIGINS = [
    "https://snapbuy-0zkz.onrender.com",
    "https://snapbuy-frontend.onrender.com",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://snapbuy-0zkz.onrender.com",
    "https://snapbuy-frontend.onrender.com", 
    "http://localhost:5173",
]
