from django.db import models


class MatomoRequest(models.Model):
    data = models.TextField()
    user_agent = models.TextField()
    sent = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created"]
