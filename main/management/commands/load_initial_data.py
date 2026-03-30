from django.core.management.base import BaseCommand
from main.models import Category, Product, Collection

class Command(BaseCommand):
    help = 'Load initial product and collection data'

    def handle(self, *args, **kwargs):
        # Create Categories
        categories = {
            'shoes': {'name': 'Footwear', 'icon': 'fa-shoe-prints'},
            'clothing': {'name': 'Apparel', 'icon': 'fa-tshirt'},
            'accessories': {'name': 'Accessories', 'icon': 'fa-gem'}
        }
        
        for slug, data in categories.items():
            cat, created = Category.objects.get_or_create(
                slug=slug,
                defaults={'name': data['name'], 'icon': data['icon']}
            )
            if created:
                self.stdout.write(f"Created category: {data['name']}")
        
        # Create Products
        products_data = [
            {
                'name': 'Premium Leather Sneakers',
                'slug': 'premium-leather-sneakers',
                'category_slug': 'shoes',
                'price': 129.99,
                'description': 'Handcrafted premium leather sneakers with comfort insole. Perfect for daily wear.',
                'image': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
                'rating': 4.8,
                'in_stock': True,
                'on_sale': True,
                'brand': 'luxe'
            },
            {
                'name': 'Minimalist Watch',
                'slug': 'minimalist-watch',
                'category_slug': 'accessories',
                'price': 89.99,
                'description': 'Elegant minimalist watch with stainless steel band. Water resistant up to 50m.',
                'image': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop',
                'rating': 4.6,
                'in_stock': True,
                'on_sale': False,
                'brand': 'premium'
            },
            {
                'name': 'Cotton Oversized Shirt',
                'slug': 'cotton-oversized-shirt',
                'category_slug': 'clothing',
                'price': 59.99,
                'description': 'Breathable cotton oversized shirt. Available in multiple colors. 100% organic cotton.',
                'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
                'rating': 4.5,
                'in_stock': True,
                'on_sale': True,
                'brand': 'urban'
            },
            {
                'name': 'Designer Backpack',
                'slug': 'designer-backpack',
                'category_slug': 'accessories',
                'price': 79.99,
                'description': 'Water-resistant backpack with laptop compartment. Fits up to 15-inch laptops.',
                'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                'rating': 4.7,
                'in_stock': True,
                'on_sale': False,
                'brand': 'luxe'
            },
            {
                'name': 'Running Shoes',
                'slug': 'running-shoes',
                'category_slug': 'shoes',
                'price': 149.99,
                'description': 'Lightweight running shoes with maximum cushioning. Breathable mesh upper.',
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
                'rating': 4.9,
                'in_stock': True,
                'on_sale': True,
                'brand': 'premium'
            },
            {
                'name': 'Silk Scarf',
                'slug': 'silk-scarf',
                'category_slug': 'accessories',
                'price': 39.99,
                'description': 'Luxury silk scarf with artistic print. 100% pure silk, hand-rolled edges.',
                'image': 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop',
                'rating': 4.4,
                'in_stock': False,
                'on_sale': False,
                'brand': 'luxe'
            },
            {
                'name': 'Denim Jacket',
                'slug': 'denim-jacket',
                'category_slug': 'clothing',
                'price': 99.99,
                'description': 'Classic denim jacket with modern fit. Button closure, chest pockets.',
                'image': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
                'rating': 4.7,
                'in_stock': True,
                'on_sale': False,
                'brand': 'urban'
            },
            {
                'name': 'Leather Wallet',
                'slug': 'leather-wallet',
                'category_slug': 'accessories',
                'price': 49.99,
                'description': 'Genuine leather wallet with RFID protection. Multiple card slots.',
                'image': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
                'rating': 4.6,
                'in_stock': True,
                'on_sale': True,
                'brand': 'premium'
            }
        ]
        
        for product_data in products_data:
            category = Category.objects.get(slug=product_data['category_slug'])
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    'name': product_data['name'],
                    'category': category,
                    'price': product_data['price'],
                    'description': product_data['description'],
                    'image': product_data['image'],
                    'rating': product_data['rating'],
                    'in_stock': product_data['in_stock'],
                    'on_sale': product_data['on_sale'],
                    'brand': product_data['brand']
                }
            )
            if created:
                self.stdout.write(f"Created product: {product_data['name']}")
        
        # Create Collections
        collections_data = [
            {
                'name': 'Summer Breeze',
                'slug': 'summer-breeze',
                'description': 'Light and airy pieces perfect for warm summer days.',
                'short_desc': 'Beat the heat in style',
                'image': 'https://images.unsplash.com/photo-1503342219983-3a4e9a2f0e3b?w=200&h=200&fit=crop',
                'bg_image': 'https://images.unsplash.com/photo-1503342219983-3a4e9a2f0e3b?w=800&h=600&fit=crop',
                'featured': True,
                'product_slugs': ['premium-leather-sneakers', 'cotton-oversized-shirt']
            },
            {
                'name': 'Urban Edge',
                'slug': 'urban-edge',
                'description': 'Streetwear inspired collection for the modern urban explorer.',
                'short_desc': 'City style redefined',
                'image': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop',
                'bg_image': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop',
                'featured': True,
                'product_slugs': ['denim-jacket', 'designer-backpack']
            },
            {
                'name': 'Luxury Edit',
                'slug': 'luxury-edit',
                'description': 'Premium selection of high-end pieces for those who appreciate the finer things.',
                'short_desc': 'Timeless elegance',
                'image': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
                'bg_image': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
                'featured': True,
                'product_slugs': ['minimalist-watch', 'leather-wallet']
            }
        ]
        
        for collection_data in collections_data:
            collection, created = Collection.objects.get_or_create(
                slug=collection_data['slug'],
                defaults={
                    'name': collection_data['name'],
                    'description': collection_data['description'],
                    'short_desc': collection_data['short_desc'],
                    'image': collection_data['image'],
                    'bg_image': collection_data['bg_image'],
                    'featured': collection_data['featured']
                }
            )
            
            if created:
                # Add products to collection
                for product_slug in collection_data['product_slugs']:
                    try:
                        product = Product.objects.get(slug=product_slug)
                        collection.products.add(product)
                    except Product.DoesNotExist:
                        pass
                self.stdout.write(f"Created collection: {collection_data['name']}")
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded all data!'))