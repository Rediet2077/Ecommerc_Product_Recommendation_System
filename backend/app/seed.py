from .database import SessionLocal
from .models import User, Category, Product, Rating
from .auth import hash_password
import random

PRODUCTS_DATA = [
    # Electronics (category index 0)
    {"name": "Wireless Headphones", "brand": "Sony", "price": 3200, "original_price": 6500, "cat": 0, "stock": 50,
     "description": "High quality wireless headphones with active noise cancellation and 30-hour battery life.",
     "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"},
    {"name": "Smart Watch Pro", "brand": "Samsung", "price": 15999, "original_price": 21000, "cat": 0, "stock": 30,
     "description": "Advanced smartwatch with health monitoring, GPS, and AMOLED display.",
     "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"},
    {"name": "Gaming Mouse RGB", "brand": "Logitech", "price": 1600, "original_price": 2600, "cat": 0, "stock": 80,
     "description": "High-precision gaming mouse with RGB lighting and programmable buttons.",
     "image_url": "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400"},
    {"name": "Mechanical Keyboard", "brand": "Razer", "price": 4500, "original_price": 6000, "cat": 0, "stock": 40,
     "description": "Compact TKL mechanical keyboard with Cherry MX switches and RGB backlighting.",
     "image_url": "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400"},
    {"name": "DSLR Camera 24MP", "brand": "Canon", "price": 35000, "original_price": 45000, "cat": 0, "stock": 15,
     "description": "Professional DSLR camera with 24MP sensor, 4K video, and dual pixel autofocus.",
     "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400"},
    {"name": "Bluetooth Speaker", "brand": "JBL", "price": 1300, "original_price": 2600, "cat": 0, "stock": 90,
     "description": "Portable 360-degree Bluetooth speaker with waterproof design and 12-hour battery.",
     "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"},
    {"name": "Laptop Stand", "brand": "Nexstand", "price": 900, "original_price": 1400, "cat": 0, "stock": 60,
     "description": "Adjustable ergonomic aluminum laptop stand compatible with all laptops.",
     "image_url": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400"},
    {"name": "USB-C Hub 7-in-1", "brand": "Anker", "price": 1800, "original_price": 2400, "cat": 0, "stock": 55,
     "description": "7-in-1 USB-C hub with HDMI 4K, USB 3.0 ports, SD card reader and PD charging.",
     "image_url": "https://images.unsplash.com/photo-1625314897518-bb4fe6e95229?w=400"},
    {"name": "Dell Inspiron 15", "brand": "Dell", "price": 29500, "original_price": 40000, "cat": 0, "stock": 20,
     "description": "15.6-inch laptop with Intel Core i5, 8GB RAM, 256GB SSD and Full HD display.",
     "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400"},
    {"name": "MacBook Air M2", "brand": "Apple", "price": 67000, "original_price": 80000, "cat": 0, "stock": 12,
     "description": "Apple MacBook Air with M2 chip, 8GB RAM, 256GB SSD and 18-hour battery life.",
     "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"},
    {"name": "Wireless Earbuds", "brand": "Apple", "price": 8500, "original_price": 11000, "cat": 0, "stock": 45,
     "description": "True wireless earbuds with active noise cancellation and spatial audio support.",
     "image_url": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400"},
    {"name": "4K Monitor 27\"", "brand": "LG", "price": 22000, "original_price": 30000, "cat": 0, "stock": 18,
     "description": "27-inch 4K UHD IPS monitor with HDR400 and USB-C connectivity.",
     "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"},
    # Fashion (category index 1)
    {"name": "Slim Fit Chinos", "brand": "Zara", "price": 1200, "original_price": 1800, "cat": 1, "stock": 70,
     "description": "Classic slim-fit chinos made from premium stretch cotton, perfect for casual wear.",
     "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"},
    {"name": "Leather Jacket", "brand": "H&M", "price": 8000, "original_price": 13000, "cat": 1, "stock": 25,
     "description": "Premium genuine leather jacket with slim fit design and quilted lining.",
     "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"},
    {"name": "Running Shoes", "brand": "Nike", "price": 4300, "original_price": 7000, "cat": 1, "stock": 60,
     "description": "Lightweight running shoes with React foam cushioning and breathable mesh upper.",
     "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
    {"name": "Floral Summer Dress", "brand": "Mango", "price": 1500, "original_price": 2200, "cat": 1, "stock": 45,
     "description": "Beautiful floral print summer dress with adjustable straps and A-line silhouette.",
     "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"},
    {"name": "Classic Sunglasses", "brand": "Ray-Ban", "price": 6500, "original_price": 9600, "cat": 1, "stock": 35,
     "description": "Classic aviator sunglasses with UV400 polarized lenses and gold metal frame.",
     "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"},
    {"name": "Linen Shirt", "brand": "Uniqlo", "price": 900, "original_price": 1400, "cat": 1, "stock": 80,
     "description": "Breathable premium linen shirt, perfect for warm Ethiopian climate.",
     "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"},
    {"name": "Leather Belt", "brand": "Gucci", "price": 3200, "original_price": 5000, "cat": 1, "stock": 50,
     "description": "Genuine leather reversible belt with polished buckle, available in multiple sizes.",
     "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"},
    {"name": "Hoodie Sweatshirt", "brand": "Adidas", "price": 2100, "original_price": 3200, "cat": 1, "stock": 55,
     "description": "Cozy pullover hoodie in soft fleece fabric with kangaroo pocket.",
     "image_url": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400"},
    {"name": "Sneakers White", "brand": "Puma", "price": 3500, "original_price": 5500, "cat": 1, "stock": 40,
     "description": "Clean white leather sneakers with cushioned sole, perfect for everyday wear.",
     "image_url": "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400"},
    {"name": "Tote Bag Canvas", "brand": "Fossil", "price": 1800, "original_price": 2800, "cat": 1, "stock": 65,
     "description": "Large canvas tote bag with interior pockets and zip closure, great for daily use.",
     "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"},
    # Home (category index 2)
    {"name": "Coffee Maker", "brand": "Nespresso", "price": 4800, "original_price": 7500, "cat": 2, "stock": 35,
     "description": "Single-serve espresso machine with built-in milk frother and 19-bar pressure pump.",
     "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"},
    {"name": "LED Desk Lamp", "brand": "Philips", "price": 1900, "original_price": 3200, "cat": 2, "stock": 55,
     "description": "Smart LED desk lamp with adjustable brightness, color temperature and USB charging port.",
     "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"},
    {"name": "Air Purifier", "brand": "Xiaomi", "price": 8500, "original_price": 12000, "cat": 2, "stock": 22,
     "description": "HEPA air purifier covering 60m², removes 99.97% of dust, pollen and PM2.5 particles.",
     "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"},
    {"name": "Non-Stick Cookware Set", "brand": "Tefal", "price": 5500, "original_price": 8000, "cat": 2, "stock": 28,
     "description": "5-piece non-stick cookware set with Thermo-Spot technology, oven safe up to 175°C.",
     "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"},
    {"name": "Blender Pro", "brand": "Vitamix", "price": 11000, "original_price": 16000, "cat": 2, "stock": 18,
     "description": "High-performance blender with variable speed control, perfect for smoothies and soups.",
     "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400"},
    {"name": "Throw Pillow Set", "brand": "IKEA", "price": 650, "original_price": 950, "cat": 2, "stock": 100,
     "description": "Set of 4 decorative throw pillows with removable covers in various colors.",
     "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"},
    {"name": "Smart LED Bulb", "brand": "Philips Hue", "price": 850, "original_price": 1200, "cat": 2, "stock": 120,
     "description": "Wi-Fi enabled smart bulb, 16 million colors, compatible with Alexa and Google Home.",
     "image_url": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400"},
    {"name": "Wall Clock Wooden", "brand": "Umbra", "price": 1200, "original_price": 1800, "cat": 2, "stock": 40,
     "description": "Minimalist wooden wall clock with silent sweep mechanism, 30cm diameter.",
     "image_url": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400"},
    {"name": "Electric Kettle", "brand": "Bosch", "price": 2200, "original_price": 3000, "cat": 2, "stock": 45,
     "description": "1.7L stainless steel electric kettle with temperature control and keep warm function.",
     "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400"},
    {"name": "Scented Candles Set", "brand": "Yankee", "price": 750, "original_price": 1100, "cat": 2, "stock": 80,
     "description": "Set of 3 hand-poured soy wax candles in lavender, vanilla and sandalwood scents.",
     "image_url": "https://images.unsplash.com/photo-1603905616625-5bb07a7a5b34?w=400"},
    # Beauty (category index 3)
    {"name": "Face Moisturizer SPF 50", "brand": "Cetaphil", "price": 950, "original_price": 1400, "cat": 3, "stock": 75,
     "description": "Daily face moisturizer with SPF 50 protection, suitable for all skin types.",
     "image_url": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"},
    {"name": "Perfume Intense", "brand": "Chanel", "price": 12000, "original_price": 16000, "cat": 3, "stock": 20,
     "description": "Luxury long-lasting eau de parfum with notes of jasmine, rose and musk.",
     "image_url": "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400"},
    {"name": "Hair Dryer 2200W", "brand": "Dyson", "price": 18000, "original_price": 24000, "cat": 3, "stock": 15,
     "description": "Professional ionic hair dryer with 2200W motor and 3 heat settings.",
     "image_url": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400"},
    {"name": "Lipstick Collection", "brand": "MAC", "price": 1600, "original_price": 2200, "cat": 3, "stock": 60,
     "description": "Long-wearing matte lipstick with rich pigmentation available in 20 shades.",
     "image_url": "https://images.unsplash.com/photo-1586495777744-4e6232bf9043?w=400"},
    {"name": "Vitamin C Serum", "brand": "The Ordinary", "price": 1100, "original_price": 1600, "cat": 3, "stock": 85,
     "description": "20% Vitamin C brightening serum that reduces dark spots and boosts radiance.",
     "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"},
    {"name": "Eye Shadow Palette", "brand": "Urban Decay", "price": 3500, "original_price": 5000, "cat": 3, "stock": 30,
     "description": "12-shade eye shadow palette with matte and shimmer finishes for every look.",
     "image_url": "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400"},
    {"name": "Body Lotion 500ml", "brand": "Nivea", "price": 450, "original_price": 700, "cat": 3, "stock": 100,
     "description": "Deep moisturizing body lotion with shea butter, absorbs quickly without grease.",
     "image_url": "https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=400"},
    {"name": "Sunscreen SPF 100", "brand": "Neutrogena", "price": 1200, "original_price": 1800, "cat": 3, "stock": 50,
     "description": "Broad spectrum SPF 100 sunscreen, water resistant, lightweight and non-greasy.",
     "image_url": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400"},
    # Sports (category index 4)
    {"name": "Yoga Mat Premium", "brand": "Gaiam", "price": 1600, "original_price": 2600, "cat": 4, "stock": 100,
     "description": "6mm thick non-slip yoga mat with alignment lines, includes carrying strap.",
     "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"},
    {"name": "Adjustable Dumbbell Set", "brand": "Bowflex", "price": 7000, "original_price": 10700, "cat": 4, "stock": 40,
     "description": "Space-saving adjustable dumbbell set, replaces 15 sets of weights (2-24 kg).",
     "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"},
    {"name": "Football Official Size", "brand": "Adidas", "price": 1200, "original_price": 1800, "cat": 4, "stock": 70,
     "description": "FIFA-approved official size 5 football with premium hand-stitched panels.",
     "image_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"},
    {"name": "Jump Rope Speed", "brand": "WOD Nation", "price": 550, "original_price": 850, "cat": 4, "stock": 90,
     "description": "Adjustable speed jump rope with ball bearings, suitable for all skill levels.",
     "image_url": "https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=400"},
    {"name": "Resistance Bands Set", "brand": "TheraBand", "price": 800, "original_price": 1300, "cat": 4, "stock": 85,
     "description": "Set of 5 resistance bands in different tension levels for full body workouts.",
     "image_url": "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=400"},
    {"name": "Running Backpack 20L", "brand": "Camelback", "price": 3800, "original_price": 5500, "cat": 4, "stock": 30,
     "description": "Lightweight 20L running backpack with hydration bladder compartment and reflective strips.",
     "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"},
    {"name": "Tennis Racket Pro", "brand": "Wilson", "price": 4500, "original_price": 6500, "cat": 4, "stock": 25,
     "description": "Intermediate-level tennis racket with graphite frame and pre-strung with synthetic gut.",
     "image_url": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400"},
    {"name": "Cycling Helmet", "brand": "Bell", "price": 2800, "original_price": 4200, "cat": 4, "stock": 35,
     "description": "MIPS-equipped cycling helmet with 18 air vents and adjustable retention system.",
     "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"},
    # Books (category index 5)
    {"name": "Atomic Habits", "brand": "James Clear", "price": 380, "original_price": 550, "cat": 5, "stock": 120,
     "description": "Bestselling guide to building good habits and breaking bad ones, over 10M copies sold.",
     "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"},
    {"name": "The Psychology of Money", "brand": "Morgan Housel", "price": 320, "original_price": 480, "cat": 5, "stock": 100,
     "description": "Timeless lessons on wealth, greed, and happiness through 19 short stories.",
     "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400"},
    {"name": "Rich Dad Poor Dad", "brand": "Robert Kiyosaki", "price": 280, "original_price": 420, "cat": 5, "stock": 90,
     "description": "Personal finance classic about building wealth through financial intelligence.",
     "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"},
    {"name": "Think and Grow Rich", "brand": "Napoleon Hill", "price": 250, "original_price": 380, "cat": 5, "stock": 80,
     "description": "Classic self-help book that has inspired millions to achieve their financial goals.",
     "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"},
    {"name": "The Alchemist", "brand": "Paulo Coelho", "price": 290, "original_price": 430, "cat": 5, "stock": 95,
     "description": "Magical tale about following your dreams, translated into 80+ languages worldwide.",
     "image_url": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"},
    {"name": "Zero to One", "brand": "Peter Thiel", "price": 350, "original_price": 520, "cat": 5, "stock": 75,
     "description": "Notes on startups and how to build the future, by PayPal co-founder Peter Thiel.",
     "image_url": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400"},
    {"name": "Sapiens", "brand": "Yuval Noah Harari", "price": 420, "original_price": 600, "cat": 5, "stock": 70,
     "description": "A brief history of humankind exploring how Homo sapiens came to dominate the world.",
     "image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400"},
    # Toys (category index 6)
    {"name": "LEGO City Set 500pcs", "brand": "LEGO", "price": 3200, "original_price": 4800, "cat": 6, "stock": 40,
     "description": "500-piece LEGO City set to build a police station, includes 4 mini-figures.",
     "image_url": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"},
    {"name": "Remote Control Car", "brand": "Hot Wheels", "price": 1500, "original_price": 2200, "cat": 6, "stock": 55,
     "description": "1:14 scale RC car with 2.4GHz controller, reaches up to 25 km/h on flat surfaces.",
     "image_url": "https://images.unsplash.com/photo-1559591935-c61e6e5e8d3e?w=400"},
    {"name": "Barbie Dreamhouse", "brand": "Mattel", "price": 5500, "original_price": 8000, "cat": 6, "stock": 20,
     "description": "3-storey Barbie Dreamhouse with 8 rooms, 70+ accessories and working elevator.",
     "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"},
    {"name": "Educational Puzzle 100pcs", "brand": "Ravensburger", "price": 580, "original_price": 900, "cat": 6, "stock": 80,
     "description": "100-piece educational puzzle featuring world map, suitable for ages 6+.",
     "image_url": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400"},
    {"name": "Stuffed Teddy Bear", "brand": "Jellycat", "price": 900, "original_price": 1300, "cat": 6, "stock": 65,
     "description": "Super soft 40cm stuffed teddy bear made from hypoallergenic plush fabric.",
     "image_url": "https://images.unsplash.com/photo-1555169062-013468b47731?w=400"},
    {"name": "Play-Doh Mega Set", "brand": "Hasbro", "price": 850, "original_price": 1200, "cat": 6, "stock": 70,
     "description": "36-can Play-Doh set with tools, cutters and molds for creative modeling fun.",
     "image_url": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400"},
    {"name": "Board Game Monopoly", "brand": "Hasbro", "price": 1100, "original_price": 1600, "cat": 6, "stock": 45,
     "description": "Classic Monopoly board game with updated modern edition, for 2-8 players.",
     "image_url": "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400"},
    # More (category index 7)
    {"name": "Travel Backpack 40L", "brand": "Osprey", "price": 5500, "original_price": 8000, "cat": 7, "stock": 30,
     "description": "40L carry-on travel backpack with laptop compartment and hip belt for comfort.",
     "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"},
    {"name": "Stainless Water Bottle", "brand": "Hydro Flask", "price": 1400, "original_price": 2000, "cat": 7, "stock": 85,
     "description": "32oz double-wall vacuum insulated water bottle, keeps drinks cold 24h / hot 12h.",
     "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"},
    {"name": "Sunglasses UV400", "brand": "Oakley", "price": 4800, "original_price": 7200, "cat": 7, "stock": 40,
     "description": "Sport sunglasses with UV400 polarized lenses and impact-resistant O-Matter frame.",
     "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"},
    {"name": "Wireless Charger Pad", "brand": "Belkin", "price": 1100, "original_price": 1700, "cat": 7, "stock": 60,
     "description": "15W fast wireless charging pad compatible with all Qi-enabled devices.",
     "image_url": "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400"},
    {"name": "Leather Wallet Slim", "brand": "Bellroy", "price": 2200, "original_price": 3200, "cat": 7, "stock": 50,
     "description": "Ultra-slim genuine leather bifold wallet with RFID blocking and 8 card slots.",
     "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"},
]


def seed_database():
    db = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            print("Database already seeded.")
            return

        # Categories
        categories_names = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys", "More"]
        cat_objs = []
        for name in categories_names:
            c = Category(name=name)
            db.add(c)
            cat_objs.append(c)
        db.flush()

        # Admin user
        admin = User(name="Admin User", email="admin@shopease.com",
                     password_hash=hash_password("admin123"), is_admin=True)
        db.add(admin)

        # Regular user
        user1 = User(name="John Doe", email="john@example.com",
                     password_hash=hash_password("pass1234"))
        db.add(user1)
        db.flush()

        # Create products
        product_objs = []
        for pd in PRODUCTS_DATA:
            p = Product(
                name=pd["name"],
                brand=pd["brand"],
                price=pd["price"],
                original_price=pd.get("original_price"),
                description=pd["description"],
                image_url=pd["image_url"],
                stock=pd["stock"],
                category_id=cat_objs[pd["cat"]].id,
            )
            db.add(p)
            product_objs.append(p)
        db.flush()

        # Add ratings for all products
        import random
        for product in product_objs:
            num_ratings = random.randint(2, 8)
            for _ in range(num_ratings):
                rating_val = round(random.uniform(3.2, 5.0), 1)
                r = Rating(user_id=user1.id, product_id=product.id,
                           rating=rating_val, review="Great product!")
                db.add(r)

        db.commit()
        print(f"Database seeded with {len(product_objs)} products across {len(cat_objs)} categories.")
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
        # Don't crash startup — seeding failure is non-fatal
    finally:
        db.close()
