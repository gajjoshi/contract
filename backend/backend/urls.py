from django.contrib import admin
from django.urls import path
from backend import views  # Replace 'your_app_name' with your app's name

urlpatterns = [
    path('admin/', admin.site.urls),
    path('create_user/', views.create_user),  # Add this line
    path('get_user/', views.get_user),  # Add this line
    path('extract_text/', views.extract_text),  # Endpoint for text extraction
    path('submit_data/', views.submit_data),    # New endpoint for submitting form data
    path("get_collection_data/", views.get_collection_data),  # Fetch collection data
    path('check_user/', views.check_user),  # Add this line





]
