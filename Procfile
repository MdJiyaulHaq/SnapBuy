#release: python manage.py migrate
web: gunicorn storefront.wsgi
celery_worker: celery -A storefront worker --loglevel=info
celery_beat: celery -A storefront beat --loglevel=info
