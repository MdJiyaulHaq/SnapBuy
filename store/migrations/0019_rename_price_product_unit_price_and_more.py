# Generated by Django 5.0.4 on 2025-01-30 07:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0018_alter_order_options_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="product",
            old_name="price",
            new_name="unit_price",
        ),
        migrations.RemoveField(
            model_name="product",
            name="promotions",
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="order",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="items",
                to="store.order",
            ),
        ),
    ]
