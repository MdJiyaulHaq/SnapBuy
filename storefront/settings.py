"""
Django settings for storefront project.
Unified settings for both development and production environments.
"""

import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from celery.schedules import crontab
from environ import Env

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = Env()
# Read .env file from BASE_DIR
env_file = BASE_DIR / ".env"
if env_file.exists():
    Env.read_env(str(env_file))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=True)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env(
    "SECRET_KEY",
    default=(
        "django-insecure-hs6j037urx6iav+7#10%-vu4l4f5@@-1_zo)oft4g7$vf2$jmp"
        if DEBUG
        else None
    ),
)

# Determine if running in production
IS_PRODUCTION = env("ENVIRONMENT", default="development") == "production"

# Allowed hosts
if IS_PRODUCTION:
    ALLOWED_HOSTS = [
        "snapbuy-0zkz.onrender.com",
        ".onrender.com",
    ]
else:
    ALLOWED_HOSTS = ["*"]

# Application definition
if DEBUG and not IS_PRODUCTION:
    # Development: Include Unfold admin
    INSTALLED_APPS = [
        "unfold",  # before django.contrib.admin
        "unfold.contrib.filters",
        "unfold.contrib.forms",
        "unfold.contrib.inlines",
        "unfold.contrib.import_export",
        "unfold.contrib.guardian",
        "unfold.contrib.simple_history",
        "unfold.contrib.location_field",
        "unfold.contrib.constance",
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        "corsheaders",
        "django_filters",
        "rest_framework",
        "drf_yasg",
        "djoser",
        "playground",
        "store",
        "tags",
        "core",
        "silk",
        "debug_toolbar",
    ]
else:
    # Production: Standard admin
    INSTALLED_APPS = [
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "whitenoise.runserver_nostatic",
        "django.contrib.staticfiles",
        "corsheaders",
        "django_filters",
        "rest_framework",
        "drf_yasg",
        "djoser",
        "playground",
        "store",
        "tags",
        "core",
    ]

# Middleware configuration
if DEBUG and not IS_PRODUCTION:
    # Development middleware
    MIDDLEWARE = [
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "silk.middleware.SilkyMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]
else:
    # Production middleware
    MIDDLEWARE = [
        "django.middleware.security.SecurityMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "corsheaders.middleware.CorsMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]

INTERNAL_IPS = [
    "127.0.0.1",
]

ROOT_URLCONF = "storefront.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend" / "dist"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "storefront.wsgi.application"

# Database
if IS_PRODUCTION:
    DATABASES = {
        "default": dj_database_url.config(
            default="sqlite:///db.sqlite3",
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=False,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATICFILES_DIRS = [BASE_DIR / "frontend" / "dist" / "assets"]
STATIC_URL = "/assets/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Static files storage for production
if IS_PRODUCTION:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST Framework
REST_FRAMEWORK = {
    "COERCE_DECIMAL_TO_STRING": False,
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

# Djoser
DJOSER = {
    "SERIALIZERS": {
        "user_create": "core.serializers.UserCreateSerializer",
        "current_user": "core.serializers.UserSerializer",
    }
}

# JWT
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("JWT",),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=5),
}

# Custom User Model
AUTH_USER_MODEL = "core.User"

# Admin emails
ADMINS = [
    ("Md", "md@storefront.com"),
    ("admin", "admin@storefront.com"),
]

# Celery Configuration
if IS_PRODUCTION:
    REDIS_URL = env("REDIS_URL")
    CELERY_BROKER_URL = REDIS_URL
else:
    CELERY_BROKER_URL = "redis://localhost:6379/1"

CELERY_BEAT_SCHEDULE = {
    "monthly_report": {
        "task": "playground.tasks.monthly_report",
        "schedule": crontab(day_of_month=1, hour=4, minute=30),
        "args": ["Your monthly report is being generated"],
    }
}

# Cache Configuration
if IS_PRODUCTION:
    REDIS_URL = env("REDIS_URL")
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379/2",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
        }
    }

# Email Configuration
if IS_PRODUCTION:
    EMAIL_HOST = env("EMAIL_HOST")
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
    EMAIL_PORT = env.int("EMAIL_PORT", default=587)
    DEFAULT_EMAIL_FROM = env("DEFAULT_EMAIL_FROM", default="from@storefront.com")
else:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = "localhost"
    EMAIL_HOST_USER = ""
    EMAIL_HOST_PASSWORD = ""
    EMAIL_PORT = 8025
    DEFAULT_EMAIL_FROM = "from@storefront.com"

# CORS Configuration
if IS_PRODUCTION:
    CORS_ALLOWED_ORIGINS = [
        "https://snapbuy-0zkz.onrender.com",
        "https://snapbuy-frontend.onrender.com",
        "http://localhost:5173",
    ]
    CSRF_TRUSTED_ORIGINS = [
        "https://snapbuy-0zkz.onrender.com",
        "https://snapbuy-frontend.onrender.com",
        "http://localhost:5173",
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

CORS_ALLOW_CREDENTIALS = True

# Logging Configuration
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{asctime} ({levelname}) - {name} - {message}",
            "style": "{",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "general.log",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "": {
            "handlers": ["console", "file"],
            "level": env("DJANGO_LOG_LEVEL", default="INFO"),
        }
    },
}
