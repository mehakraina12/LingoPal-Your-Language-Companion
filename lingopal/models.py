# models.py
from django.db import models

class Language(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'languages'

    def _str_(self):
        return self.name

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=128)  # You might want to use a more secure way to store passwords in production
    imgbb_url = models.CharField(max_length=255, blank=True, null=True)  # Field to store ImgBB image URL
    native_languages = models.ManyToManyField(Language, related_name='native_speakers')
    language_to_learn = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='learners', null=True)
    about_me = models.TextField()

    class Meta:
        db_table = 'user_profiles'

    def _str_(self):
        return self.username