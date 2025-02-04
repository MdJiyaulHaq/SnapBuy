from django.apps import AppConfig

#store/apps.py
class StoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "store"
    #override this method and import signal
    def ready(self):
        import store.signals
