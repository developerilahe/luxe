from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    
    # API Endpoints
    path('api/products/', views.api_products, name='api_products'),
    path('api/categories/', views.api_categories, name='api_categories'),
    path('api/collections/', views.api_collections, name='api_collections'),
    path('api/collections/<slug:slug>/', views.api_collection_detail, name='api_collection_detail'),
    path('api/contact/', views.api_contact, name='api_contact'),
    path('api/subscribe/', views.api_subscribe, name='api_subscribe'),
    path('api/cart/', views.api_cart, name='api_cart'),
    path('api/cart/add/', views.api_cart_add, name='api_cart_add'),
    path('api/cart/update/', views.api_cart_update, name='api_cart_update'),
]