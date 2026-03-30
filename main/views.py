from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Product, Category, Collection, ContactMessage, Subscriber, Cart, CartItem

def index(request):
    """Main page view"""
    return render(request, 'main/index.html')

def api_products(request):
    """API endpoint for products"""
    category = request.GET.get('category', 'all')
    search = request.GET.get('search', '')
    min_price = request.GET.get('min_price', 0)
    max_price = request.GET.get('max_price', 500)
    
    products = Product.objects.filter(in_stock=True)
    
    if category != 'all':
        products = products.filter(category__slug=category)
    
    if search:
        products = products.filter(name__icontains=search)
    
    if min_price:
        products = products.filter(price__gte=float(min_price))
    
    if max_price:
        products = products.filter(price__lte=float(max_price))
    
    data = [{
        'id': p.id,
        'name': p.name,
        'price': float(p.price),
        'category': p.category.name,
        'category_slug': p.category.slug,
        'image': p.image,
        'description': p.description,
        'rating': float(p.rating) if p.rating else 4.5,
        'inStock': p.in_stock,
        'onSale': p.on_sale,
        'brand': p.brand or ''
    } for p in products]
    
    return JsonResponse(data, safe=False)

def api_categories(request):
    """API endpoint for categories"""
    categories = Category.objects.all()
    data = [{
        'id': c.id,
        'name': c.name,
        'slug': c.slug,
        'icon': c.icon or '',
        'count': c.products.filter(in_stock=True).count()
    } for c in categories]
    return JsonResponse(data, safe=False)

def api_collections(request):
    """API endpoint for collections"""
    collections = Collection.objects.filter(featured=True)
    data = [{
        'id': c.id,
        'name': c.name,
        'slug': c.slug,
        'description': c.description,
        'short_desc': c.short_desc or '',
        'image': c.image,
        'bg_image': c.bg_image or c.image,
        'pieceCount': c.products.count(),
        'products': [{
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'image': p.image,
            'description': p.description
        } for p in c.products.all()[:10]]
    } for c in collections]
    return JsonResponse(data, safe=False)

def api_collection_detail(request, slug):
    """API endpoint for single collection"""
    try:
        collection = Collection.objects.get(slug=slug)
        data = {
            'id': collection.id,
            'name': collection.name,
            'slug': collection.slug,
            'description': collection.description,
            'short_desc': collection.short_desc or '',
            'image': collection.image,
            'bg_image': collection.bg_image or collection.image,
            'pieceCount': collection.products.count(),
            'products': [{
                'id': p.id,
                'name': p.name,
                'price': float(p.price),
                'image': p.image,
                'description': p.description
            } for p in collection.products.all()]
        }
        return JsonResponse(data)
    except Collection.DoesNotExist:
        return JsonResponse({'error': 'Collection not found'}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def api_contact(request):
    """Contact form submission"""
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        newsletter = data.get('newsletter', False)
        
        # Save to database
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Subscribe to newsletter if checked
        if newsletter:
            Subscriber.objects.get_or_create(email=email)
        
        return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def api_subscribe(request):
    """Newsletter subscription"""
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({'success': False, 'error': 'Email is required'}, status=400)
        
        subscriber, created = Subscriber.objects.get_or_create(email=email)
        
        if created:
            return JsonResponse({'success': True, 'message': 'Subscribed successfully!'})
        else:
            return JsonResponse({'success': True, 'message': 'Already subscribed!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

def get_or_create_cart(request):
    """Helper to get or create cart"""
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key
    
    cart, created = Cart.objects.get_or_create(
        session_key=session_key,
        defaults={'session_key': session_key}
    )
    
    return cart

def api_cart(request):
    """Get cart contents"""
    cart = get_or_create_cart(request)
    items = [{
        'id': item.product.id,
        'name': item.product.name,
        'price': float(item.product.price),
        'quantity': item.quantity,
        'image': item.product.image,
        'total': float(item.get_total())
    } for item in cart.items.all()]
    
    return JsonResponse({
        'items': items,
        'total': float(cart.get_total()),
        'count': cart.get_item_count()
    })

@csrf_exempt
@require_http_methods(["POST"])
def api_cart_add(request):
    """Add product to cart"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        product = Product.objects.get(id=product_id, in_stock=True)
        cart = get_or_create_cart(request)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return JsonResponse({
            'success': True,
            'message': f'{product.name} added to cart',
            'count': cart.get_item_count(),
            'total': float(cart.get_total())
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def api_cart_update(request):
    """Update cart item quantity"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        
        cart = get_or_create_cart(request)
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
        except CartItem.DoesNotExist:
            pass
        
        return JsonResponse({
            'success': True,
            'count': cart.get_item_count(),
            'total': float(cart.get_total())
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)