from .common import *

SECRET_KEY = "django-insecure-br7kulf_jaeaq*6de!%yzr1n(q=zucl)^(1kl=m8c#b5!t$w69"

DEBUG = True


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "storefront",
        "HOST": "localhost",
        "PORT": "5432",
        "USER": "root",
        "PASSWORD": "bismillah",
    }
}

CELERY_BROKER_URL = "redis://localhost:6379/1"

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/2",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}


EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "localhost"
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_PORT = 8025
DEFAULT_EMAIL_FROM = "from@storefront.com"
