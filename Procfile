#release: python manage.py migrate
web: gunicorn storefront.wsgi:application --bind 0.0.0.0:$PORT
celery_worker: celery -A storefront worker --loglevel=info
celery_beat: celery -A storefront beat --loglevel=info
