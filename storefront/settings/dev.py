from .commonSettings import *

SECRET_KEY = "django-insecure-br7kulf_jaeaq*6de!%yzr1n(q=zucl)^(1kl=m8c#b5!t$w69"

DEBUG = True


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "storefront",
        "HOST": "localhost",
        "USER": "root",
        "PASSWORD": "bismillah",
    }
}
