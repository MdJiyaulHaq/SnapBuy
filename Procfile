web: gunicorn --timeout 120 --workers=1 --bind 0.0.0.0:8080 storefront.wsgi:application
celery_worker: celery -A storefront worker --loglevel=info
celery_beat: celery -A storefront beat --loglevel=info
