from django.core.mail import send_mail, mail_admins, EmailMessage, BadHeaderError
from templated_mail.mail import BaseEmailMessage
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from .tasks import notify_customers


# Create your views here.
def say_hello(request):
    notify_customers.delay("Your video is being processed")
    return render(request, "hello.html", {"name": "Shankar"})


# def say_hello(request):
#     try:
#         # normal mails to anyone
#         send_mail(
#             subject="Welcome to Storefront",
#             message="This is plain message,",
#             html_message="This is html message",
#             from_email=settings.DEFAULT_EMAIL_FROM,
#             recipient_list=["to@storefront.com"],
#         )
#         # to admins
#         mail_admins(
#             subject="Admins, Welcome to Storefront.",
#             message="This is plain message,",
#             html_message="This is html message",
#         )
#         # Above implementation comes from class EmailMessage.
#         # Also if you want to attach files
#         msg = EmailMessage(
#             subject="Welcome to Storefront",
#             body="This is a plain message.",
#             from_email=settings.DEFAULT_EMAIL_FROM,
#             to=["to@storefront.com"],
#         )
#         msg.attach_file("playground/static/images/Md.jpg")
#         msg.send()
#         # if you want to send templated_emails
#         message = BaseEmailMessage(
#             template_name="emails/hello2.html", context={"name": "Shankar"}
#         )
#         message.send(["to@storefront.com"])
#         return render(
#             request,
#             "hello.html",
#             {"message": "Email sent successfully!", "name": "Shankar"},
#         )
#         return render(request, "hello.html", {"message": "Email sent successfully!"})
#     except BadHeaderError:
#         return render(request, "hello.html", {"message": "Invalid header found."})
#     except Exception as e:
#         return render(
#             request, "hello.html", {"message": f"Failed to send email: {str(e)}"}
#         )
