from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Collection, CollectionItem, ContactMessage, Subscriber

# Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon', 'product_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'product_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'icon', 'created_at')
        }),
    )
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Number of Products'

# Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'rating', 'in_stock', 'on_sale', 'brand', 'image_preview']
    list_filter = ['category', 'in_stock', 'on_sale', 'brand', 'created_at']
    search_fields = ['name', 'description', 'brand']
    list_editable = ['price', 'in_stock', 'on_sale', 'rating']
    readonly_fields = ['created_at', 'image_preview_large']
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description', 'brand')
        }),
        ('Pricing & Status', {
            'fields': ('price', 'rating', 'in_stock', 'on_sale')
        }),
        ('Media', {
            'fields': ('image', 'image_preview_large')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 8px; object-fit: cover;" />', obj.image)
        return "No Image"
    image_preview.short_description = 'Preview'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="200" height="200" style="border-radius: 12px; object-fit: cover;" />', obj.image)
        return "No Image"
    image_preview_large.short_description = 'Product Image'
    
    actions = ['mark_in_stock', 'mark_out_of_stock', 'mark_on_sale', 'remove_sale']
    
    def mark_in_stock(self, request, queryset):
        queryset.update(in_stock=True)
        self.message_user(request, f"{queryset.count()} products marked as in stock.")
    mark_in_stock.short_description = "Mark selected as In Stock"
    
    def mark_out_of_stock(self, request, queryset):
        queryset.update(in_stock=False)
        self.message_user(request, f"{queryset.count()} products marked as out of stock.")
    mark_out_of_stock.short_description = "Mark selected as Out of Stock"
    
    def mark_on_sale(self, request, queryset):
        queryset.update(on_sale=True)
        self.message_user(request, f"{queryset.count()} products marked as on sale.")
    mark_on_sale.short_description = "Mark selected as On Sale"
    
    def remove_sale(self, request, queryset):
        queryset.update(on_sale=False)
        self.message_user(request, f"Sale removed from {queryset.count()} products.")
    remove_sale.short_description = "Remove Sale from selected"

# Collection Admin
@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'piece_count', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['products']
    readonly_fields = ['created_at', 'piece_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'image', 'bg_image', 'short_desc', 'featured')
        }),
        ('Products', {
            'fields': ('products', 'piece_count')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def piece_count(self, obj):
        return obj.products.count()
    piece_count.short_description = 'Number of Products'

# Cart Admin
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'item_count', 'total_value', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['session_key', 'user__email', 'user__username']
    readonly_fields = ['created_at', 'updated_at', 'item_count', 'total_value']
    
    def item_count(self, obj):
        return obj.get_item_count()
    item_count.short_description = 'Items'
    
    def total_value(self, obj):
        return f"${obj.get_total():.2f}"
    total_value.short_description = 'Total'

# CartItem Admin
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity', 'item_total']
    list_filter = ['cart__created_at']
    search_fields = ['product__name', 'cart__session_key']
    readonly_fields = ['item_total']
    
    def item_total(self, obj):
        return f"${obj.get_total():.2f}"
    item_total.short_description = 'Total'

# Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    readonly_fields = ['created_at', 'total_amount']
    list_editable = ['status']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Shipping Address', {
            'fields': ('address', 'city', 'postal_code')
        }),
        ('Order Details', {
            'fields': ('total_amount', 'status', 'created_at')
        }),
    )
    
    def total_amount(self, obj):
        return f"${obj.total:.2f}"
    total_amount.short_description = 'Total'
    
    actions = ['mark_as_processing', 'mark_as_shipped', 'mark_as_delivered']
    
    def mark_as_processing(self, request, queryset):
        queryset.update(status='processing')
        self.message_user(request, f"{queryset.count()} orders marked as processing.")
    mark_as_processing.short_description = "Mark as Processing"
    
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
        self.message_user(request, f"{queryset.count()} orders marked as shipped.")
    mark_as_shipped.short_description = "Mark as Shipped"
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
        self.message_user(request, f"{queryset.count()} orders marked as delivered.")
    mark_as_delivered.short_description = "Mark as Delivered"

# OrderItem Admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'price', 'item_total']
    list_filter = ['order__status']
    search_fields = ['product__name', 'order__email']
    readonly_fields = ['item_total']
    
    def item_total(self, obj):
        return f"${obj.get_total():.2f}"
    item_total.short_description = 'Total'

# ContactMessage Admin
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, f"{queryset.count()} messages marked as read.")
    mark_as_read.short_description = "Mark as Read"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
        self.message_user(request, f"{queryset.count()} messages marked as unread.")
    mark_as_unread.short_description = "Mark as Unread"

# Subscriber Admin
@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    actions = ['activate', 'deactivate']
    
    def activate(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} subscribers activated.")
    activate.short_description = "Activate Subscribers"
    
    def deactivate(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} subscribers deactivated.")
    deactivate.short_description = "Deactivate Subscribers"

# Custom Admin Site Header
admin.site.site_header = "LUXE E-Commerce Administration"
admin.site.site_title = "LUXE Admin Portal"
admin.site.index_title = "Welcome to LUXE Admin Dashboard"