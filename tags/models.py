from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


# Define a Tag model to store tags
class Tag(models.Model):
    # Label of the tag with a maximum length of 255 characters
    label = models.CharField(max_length=255)


# Define a TaggedItem model to associate tags with any model instance
class TaggedItem(models.Model):
    # ForeignKey to the Tag model, ensuring that if a tag is deleted, the related TaggedItem is also deleted
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    # ForeignKey to the ContentType model, which allows linking to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # Field to store the primary key of the related model instance
    object_id = models.PositiveIntegerField()
    # GenericForeignKey to create a generic relation to any model instance
    content_object = GenericForeignKey()
