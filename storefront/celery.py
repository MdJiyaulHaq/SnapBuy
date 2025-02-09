from celery import Celery
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "storefront.settings")
celeryApp = Celery("storefront")
celeryApp.config_from_object("django.conf:settings", namespace="CELERY")
celeryApp.autodiscover_tasks()
