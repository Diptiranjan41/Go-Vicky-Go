import React, { useState, useEffect } from "react";
import { FaStar, FaSearch } from "react-icons/fa";

// Permanent product data with consistent images
const permanentProducts = [
  // 🎒 Essentials & Luggage
  {
    id: 1,
    name: "Travel Backpack",
    category: "Essentials & Luggage",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    description: "Durable 40L travel backpack with laptop compartment, multiple pockets, and water-resistant material. Perfect for backpacking and city travel.",
    rating: 4.5,
    reviews: 234,
    features: ["40L Capacity", "Laptop Sleeve", "Water Resistant", "TSA Approved"],
    inStock: true,
    discount: 15
  },
  {
    id: 2,
    name: "Suitcase (Trolley Bag)",
    category: "Essentials & Luggage",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    description: "Hard-shell spinner suitcase with 360-degree wheels, TSA lock, and expandable capacity. Built for frequent travelers.",
    rating: 4.7,
    reviews: 189,
    features: ["Hard Shell", "360° Wheels", "TSA Lock", "Expandable"],
    inStock: true,
    discount: 10
  },
  {
    id: 3,
    name: "Duffel Bag",
    category: "Essentials & Luggage",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop",
    description: "Versatile duffel bag with adjustable shoulder strap and multiple compartments. Ideal for gym and weekend trips.",
    rating: 4.3,
    reviews: 156,
    features: ["Adjustable Strap", "Multiple Pockets", "Lightweight", "Durable"],
    inStock: true,
    discount: 0
  },
  {
    id: 4,
    name: "Cabin Luggage",
    category: "Essentials & Luggage",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Compact cabin-sized luggage that fits in overhead compartments. Features built-in USB port and charging capability.",
    rating: 4.6,
    reviews: 278,
    features: ["Cabin Size", "USB Port", "Lightweight", "4 Wheels"],
    inStock: true,
    discount: 20
  },
  {
    id: 5,
    name: "Packing Cubes",
    category: "Essentials & Luggage",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589330694651-2a58d965d9c2?w=400&h=300&fit=crop",
    description: "Set of 4 packing cubes in different sizes to organize your luggage efficiently. Mesh top for visibility.",
    rating: 4.8,
    reviews: 342,
    features: ["4-Piece Set", "Mesh Top", "Lightweight", "Compression"],
    inStock: true,
    discount: 5
  },
  {
    id: 6,
    name: "Shoe Organizer Bag",
    category: "Essentials & Luggage",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    description: "Waterproof shoe bag to keep your shoes separate from clothes. Fits most shoe sizes.",
    rating: 4.2,
    reviews: 98,
    features: ["Waterproof", "Multiple Sizes", "Durable", "Easy Clean"],
    inStock: true,
    discount: 0
  },
  {
    id: 7,
    name: "Toiletry Bag",
    category: "Essentials & Luggage",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1553062407-78eeb4c3c9c4?w=400&h=300&fit=crop",
    description: "Hanging toiletry bag with multiple compartments and waterproof lining. Perfect for organizing bathroom essentials.",
    rating: 4.4,
    reviews: 167,
    features: ["Hanging Hook", "Waterproof", "Multiple Pockets", "Compact"],
    inStock: true,
    discount: 15
  },
  {
    id: 8,
    name: "Laundry Bag",
    category: "Essentials & Luggage",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1584824486509-9a57a5ca50fe?w=400&h=300&fit=crop",
    description: "Lightweight laundry bag for storing dirty clothes during travel. Breathable material prevents odors.",
    rating: 4.1,
    reviews: 76,
    features: ["Breathable", "Lightweight", "Compact", "Durable"],
    inStock: true,
    discount: 0
  },
  {
    id: 9,
    name: "Compression Packing Bags",
    category: "Essentials & Luggage",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1553062407-78eeb4c3c9c5?w=400&h=300&fit=crop",
    description: "Vacuum compression bags to save space in your luggage. No pump required - roll to compress.",
    rating: 4.6,
    reviews: 213,
    features: ["Space Saving", "No Pump Needed", "Waterproof", "Multi-Size"],
    inStock: true,
    discount: 10
  },
  {
    id: 10,
    name: "Travel Pouch Set",
    category: "Essentials & Luggage",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1553062407-78eeb4c3c9c6?w=400&h=300&fit=crop",
    description: "Set of 6 travel pouches for organizing electronics, documents, and accessories. RFID blocking available.",
    rating: 4.7,
    reviews: 189,
    features: ["6-Piece Set", "RFID Blocking", "Multiple Sizes", "Durable"],
    inStock: true,
    discount: 25
  },

  // ⚡ Electronics & Accessories
  {
    id: 11,
    name: "Power Bank",
    category: "Electronics & Accessories",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1609592810794-3cbcb1e7ff4b?w=400&h=300&fit=crop",
    description: "20000mAh power bank with fast charging and multiple USB ports. Can charge multiple devices simultaneously.",
    rating: 4.8,
    reviews: 456,
    features: ["20000mAh", "Fast Charging", "Multiple Ports", "Portable"],
    inStock: true,
    discount: 20
  },
  {
    id: 12,
    name: "Universal Travel Adapter",
    category: "Electronics & Accessories",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd8c?w=400&h=300&fit=crop",
    description: "Worldwide universal adapter compatible with 150+ countries. Built-in surge protection and USB ports.",
    rating: 4.5,
    reviews: 289,
    features: ["Worldwide Use", "Surge Protection", "USB Ports", "Compact"],
    inStock: true,
    discount: 15
  },
  {
    id: 13,
    name: "Noise-Cancelling Headphones",
    category: "Electronics & Accessories",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Premium noise-cancelling headphones with 30-hour battery life. Perfect for flights and busy environments.",
    rating: 4.9,
    reviews: 567,
    features: ["Active Noise Cancel", "30hr Battery", "Wireless", "Premium Sound"],
    inStock: true,
    discount: 30
  },
  {
    id: 14,
    name: "Bluetooth Earbuds",
    category: "Electronics & Accessories",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e4?w=400&h=300&fit=crop",
    description: "Wireless Bluetooth earbuds with charging case. 8-hour battery life and water-resistant design.",
    rating: 4.4,
    reviews: 234,
    features: ["Wireless", "Charging Case", "Water Resistant", "8hr Battery"],
    inStock: true,
    discount: 25
  },
  {
    id: 15,
    name: "Portable Charger Case",
    category: "Electronics & Accessories",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1609592810795-3cbcb1e7ff4b?w=400&h=300&fit=crop",
    description: "Smartphone case with built-in battery backup. Adds extra 12 hours of battery life to your phone.",
    rating: 4.3,
    reviews: 178,
    features: ["Built-in Battery", "Slim Design", "Wireless Charging", "Protective"],
    inStock: true,
    discount: 10
  },
  {
    id: 16,
    name: "USB Charging Hub",
    category: "Electronics & Accessories",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd8d?w=400&h=300&fit=crop",
    description: "6-port USB charging hub with smart charging technology. Charges all devices simultaneously.",
    rating: 4.6,
    reviews: 198,
    features: ["6 Ports", "Smart Charging", "Compact", "Fast Charge"],
    inStock: true,
    discount: 15
  },
  {
    id: 17,
    name: "Cable Organizer",
    category: "Electronics & Accessories",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd8e?w=400&h=300&fit=crop",
    description: "Travel cable organizer with multiple compartments for cables, chargers, and small accessories.",
    rating: 4.2,
    reviews: 145,
    features: ["Multiple Compartments", "Compact", "Durable", "Easy Access"],
    inStock: true,
    discount: 0
  },
  {
    id: 18,
    name: "Travel Router (Wi-Fi Hotspot)",
    category: "Electronics & Accessories",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd8f?w=400&h=300&fit=crop",
    description: "Portable Wi-Fi router and hotspot. Connect multiple devices and share internet anywhere.",
    rating: 4.7,
    reviews: 167,
    features: ["Portable", "Multi-Device", "Secure", "Long Battery"],
    inStock: true,
    discount: 20
  },
  {
    id: 19,
    name: "Portable Mini Fan",
    category: "Electronics & Accessories",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd90?w=400&h=300&fit=crop",
    description: "USB rechargeable mini fan with 3 speed settings. Perfect for hot climates and stuffy rooms.",
    rating: 4.1,
    reviews: 89,
    features: ["USB Rechargeable", "3 Speeds", "Portable", "Quiet"],
    inStock: true,
    discount: 5
  },
  {
    id: 20,
    name: "Travel Hair Dryer",
    category: "Electronics & Accessories",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd91?w=400&h=300&fit=crop",
    description: "Compact travel hair dryer with dual voltage. Foldable handle for easy packing.",
    rating: 4.4,
    reviews: 134,
    features: ["Dual Voltage", "Foldable", "Compact", "Powerful"],
    inStock: true,
    discount: 15
  },

  // 💤 Comfort & Health
  {
    id: 21,
    name: "Neck Pillow",
    category: "Comfort & Health",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1586611293998-f36f54ed0f93?w=400&h=300&fit=crop",
    description: "Memory foam neck pillow with removable washable cover. Provides optimal support during travel.",
    rating: 4.5,
    reviews: 345,
    features: ["Memory Foam", "Washable Cover", "Ergonomic", "Compact"],
    inStock: true,
    discount: 10
  },
  {
    id: 22,
    name: "Eye Mask",
    category: "Comfort & Health",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd92?w=400&h=300&fit=crop",
    description: "Contoured sleep mask with 100% blackout technology. Soft silk material for comfortable sleep.",
    rating: 4.3,
    reviews: 278,
    features: ["100% Blackout", "Silk Material", "Contoured", "Adjustable"],
    inStock: true,
    discount: 0
  },
  {
    id: 23,
    name: "Travel Blanket",
    category: "Comfort & Health",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1552733404-0617789f53e9?w=400&h=300&fit=crop",
    description: "Ultra-soft microfiber travel blanket that packs into its own compact pouch.",
    rating: 4.6,
    reviews: 189,
    features: ["Microfiber", "Compact Pouch", "Soft", "Lightweight"],
    inStock: true,
    discount: 20
  },
  {
    id: 24,
    name: "Earplugs",
    category: "Comfort & Health",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd93?w=400&h=300&fit=crop",
    description: "High-quality noise reduction earplugs for peaceful sleep during travel. Comes with carrying case.",
    rating: 4.2,
    reviews: 456,
    features: ["Noise Reduction", "Carrying Case", "Comfortable", "Reusable"],
    inStock: true,
    discount: 0
  },
  {
    id: 25,
    name: "Hand Sanitizer Bottle",
    category: "Comfort & Health",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    description: "TSA-approved 3oz hand sanitizer bottle with clip for easy attachment to bags.",
    rating: 4.0,
    reviews: 167,
    features: ["TSA Approved", "3oz Size", "With Clip", "Refillable"],
    inStock: true,
    discount: 0
  },
  {
    id: 26,
    name: "First Aid Travel Kit",
    category: "Comfort & Health",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1577733965582-db8136b7d377?w=400&h=300&fit=crop",
    description: "Comprehensive first aid kit with essential medical supplies for travel emergencies.",
    rating: 4.7,
    reviews: 234,
    features: ["Comprehensive", "Compact", "Essential Supplies", "Durable Case"],
    inStock: true,
    discount: 15
  },
  {
    id: 27,
    name: "Refillable Water Bottle",
    category: "Comfort & Health",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    rating: 4.8,
    reviews: 567,
    features: ["Insulated", "Stainless Steel", "Leak Proof", "BPA Free"],
    inStock: true,
    discount: 10
  },
  {
    id: 28,
    name: "Portable Mini Humidifier",
    category: "Comfort & Health",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd94?w=400&h=300&fit=crop",
    description: "USB-powered mini humidifier for hotel rooms. Improves air quality and prevents dry skin.",
    rating: 4.3,
    reviews: 123,
    features: ["USB Powered", "Quiet", "Compact", "Auto Shut-off"],
    inStock: true,
    discount: 5
  },
  {
    id: 29,
    name: "Travel Toothbrush Kit",
    category: "Comfort & Health",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd95?w=400&h=300&fit=crop",
    description: "Complete travel toothbrush kit with case, toothpaste, and dental floss. TSA compliant.",
    rating: 4.4,
    reviews: 198,
    features: ["Complete Kit", "TSA Compliant", "Compact Case", "Hygienic"],
    inStock: true,
    discount: 0
  },
  {
    id: 30,
    name: "Sunscreen & Skincare Set",
    category: "Comfort & Health",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd96?w=400&h=300&fit=crop",
    description: "Travel-sized sunscreen and skincare products in TSA-approved containers.",
    rating: 4.5,
    reviews: 167,
    features: ["TSA Approved", "SPF 50", "Moisturizing", "Travel Size"],
    inStock: true,
    discount: 20
  },

  // 📱 Gadgets & Smart Gear
  {
    id: 31,
    name: "GPS Tracker (for luggage)",
    category: "Gadgets & Smart Gear",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd97?w=400&h=300&fit=crop",
    description: "Smart GPS tracker for luggage with real-time location tracking and geofencing alerts.",
    rating: 4.6,
    reviews: 289,
    features: ["Real-time Tracking", "Geofencing", "Long Battery", "App Connected"],
    inStock: true,
    discount: 25
  },
  {
    id: 32,
    name: "Smartwatch",
    category: "Gadgets & Smart Gear",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd98?w=400&h=300&fit=crop",
    description: "Feature-rich smartwatch with GPS, heart rate monitoring, and travel-friendly features.",
    rating: 4.7,
    reviews: 456,
    features: ["GPS", "Heart Rate Monitor", "Water Resistant", "Long Battery"],
    inStock: true,
    discount: 30
  },
  {
    id: 33,
    name: "Travel Camera / GoPro",
    category: "Gadgets & Smart Gear",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    description: "Action camera perfect for travel adventures. Waterproof, shockproof, and 4K video recording.",
    rating: 4.9,
    reviews: 678,
    features: ["4K Video", "Waterproof", "Stabilization", "Compact"],
    inStock: true,
    discount: 35
  },
  {
    id: 34,
    name: "Mini Tripod",
    category: "Gadgets & Smart Gear",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd99?w=400&h=300&fit=crop",
    description: "Compact and flexible mini tripod for smartphones and cameras. Perfect for travel photography.",
    rating: 4.4,
    reviews: 234,
    features: ["Flexible Legs", "Compact", "Universal Mount", "Stable"],
    inStock: true,
    discount: 10
  },
  {
    id: 35,
    name: "Selfie Stick",
    category: "Gadgets & Smart Gear",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd9a?w=400&h=300&fit=crop",
    description: "Bluetooth selfie stick with extendable arm and remote shutter. Compatible with all smartphones.",
    rating: 4.2,
    reviews: 189,
    features: ["Bluetooth", "Extendable", "Remote Shutter", "Universal"],
    inStock: true,
    discount: 5
  },
  {
    id: 36,
    name: "E-Reader / Tablet",
    category: "Gadgets & Smart Gear",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd9b?w=400&h=300&fit=crop",
    description: "Lightweight e-reader with glare-free screen perfect for reading during travel.",
    rating: 4.6,
    reviews: 345,
    features: ["Glare-free Screen", "Lightweight", "Long Battery", "Large Storage"],
    inStock: true,
    discount: 20
  },
  {
    id: 37,
    name: "Portable Speaker",
    category: "Gadgets & Smart Gear",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd9c?w=400&h=300&fit=crop",
    description: "Waterproof portable Bluetooth speaker with 12-hour battery life. Perfect for outdoor adventures.",
    rating: 4.5,
    reviews: 278,
    features: ["Waterproof", "12hr Battery", "Bluetooth", "Rich Sound"],
    inStock: true,
    discount: 25
  },
  {
    id: 38,
    name: "Travel Drone",
    category: "Gadgets & Smart Gear",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
    description: "Compact travel drone with 4K camera, GPS, and foldable design. Perfect for aerial photography.",
    rating: 4.8,
    reviews: 189,
    features: ["4K Camera", "Foldable", "GPS", "Long Flight Time"],
    inStock: true,
    discount: 40
  },
  {
    id: 39,
    name: "Digital Luggage Scale",
    category: "Gadgets & Smart Gear",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd9d?w=400&h=300&fit=crop",
    description: "Digital luggage scale with backlit LCD display. Avoid overweight baggage fees.",
    rating: 4.7,
    reviews: 456,
    features: ["Digital Display", "Backlit", "Accurate", "Compact"],
    inStock: true,
    discount: 15
  },
  {
    id: 40,
    name: "RFID Passport Holder",
    category: "Gadgets & Smart Gear",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd9e?w=400&h=300&fit=crop",
    description: "RFID blocking passport holder to protect your personal information from electronic theft.",
    rating: 4.3,
    reviews: 234,
    features: ["RFID Blocking", "Multiple Slots", "Durable", "Slim Design"],
    inStock: true,
    discount: 0
  }
];

const ProductFilter = () => {
  const allCategories = [
    "All",
    ...new Set(permanentProducts.map((product) => product.category)),
  ];

  const [selectedCategory, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products] = useState(permanentProducts); // Permanent products state

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBuyNow = (product) => {
    // Store product in sessionStorage for address page
    const productDetails = {
      id: product.id,
      name: product.name,
      price: product.discount > 0 ? (product.price * (1 - product.discount/100)).toFixed(2) : product.price,
      image: product.image,
      category: product.category
    };
    
    sessionStorage.setItem('selectedProduct', JSON.stringify(productDetails));
    
    // Redirect to address page
    window.location.href = '/address';
  };

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('travelGearProducts');
    if (!savedProducts) {
      localStorage.setItem('travelGearProducts', JSON.stringify(permanentProducts));
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎒 Travel Gear Shop</h1>

      {/* Search and Filter Section */}
      <div style={styles.searchFilterContainer}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search travel gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = "#06b6d4";
              e.target.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1e293b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.categorySelect}
        >
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div style={styles.resultsCount}>
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Product Grid */}
      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.card,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(6, 182, 212, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
            }}
          >
            {/* Product Image with Discount Badge */}
            <div style={styles.imageContainer}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.image}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop`;
                }}
              />
              {product.discount > 0 && (
                <div style={styles.discountBadge}>
                  -{product.discount}%
                </div>
              )}
              {!product.inStock && (
                <div style={styles.outOfStockOverlay}>
                  Out of Stock
                </div>
              )}
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.categoryText}>{product.category}</p>
              
              {/* Rating */}
              <div style={styles.ratingContainer}>
                <div style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      style={{
                        color: i < Math.floor(product.rating) ? '#06b6d4' : '#64748b',
                        fontSize: '14px'
                      }} 
                    />
                  ))}
                </div>
                <span style={styles.ratingText}>{product.rating}</span>
                <span style={styles.reviewsText}>({product.reviews})</span>
              </div>

              {/* Price */}
              <div style={styles.priceContainer}>
                {product.discount > 0 ? (
                  <>
                    <span style={styles.originalPrice}>${product.price}</span>
                    <span style={styles.discountPrice}>
                      ${(product.price * (1 - product.discount/100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span style={styles.price}>${product.price}</span>
                )}
              </div>

              {/* Features */}
              <div style={styles.features}>
                {product.features.slice(0, 2).map((feature, index) => (
                  <span key={index} style={styles.featureTag}>✓ {feature}</span>
                ))}
              </div>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.detailsButton}
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </button>
                <button
                  style={{
                    ...styles.buyButton,
                    opacity: product.inStock ? 1 : 0.5,
                    cursor: product.inStock ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => product.inStock && handleBuyNow(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Buy Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              style={styles.closeModalButton}
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div style={styles.modalLayout}>
              {/* Left Side - Image */}
              <div style={styles.modalImageSection}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={styles.modalImage}
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop`;
                  }}
                />
                {selectedProduct.discount > 0 && (
                  <div style={styles.modalDiscountBadge}>
                    {selectedProduct.discount}% OFF
                  </div>
                )}
              </div>

              {/* Right Side - Details */}
              <div style={styles.modalDetailsSection}>
                <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
                
                {/* Rating */}
                <div style={styles.modalRating}>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        style={{
                          color: i < Math.floor(selectedProduct.rating) ? '#06b6d4' : '#64748b',
                          fontSize: '16px'
                        }} 
                      />
                    ))}
                  </div>
                  <span style={styles.modalRatingText}>
                    {selectedProduct.rating} • {selectedProduct.reviews} reviews
                  </span>
                </div>

                {/* Price */}
                <div style={styles.modalPriceContainer}>
                  {selectedProduct.discount > 0 ? (
                    <>
                      <span style={styles.modalOriginalPrice}>${selectedProduct.price}</span>
                      <span style={styles.modalDiscountPrice}>
                        ${(selectedProduct.price * (1 - selectedProduct.discount/100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span style={styles.modalPrice}>${selectedProduct.price}</span>
                  )}
                </div>

                {/* Category & Stock */}
                <div style={styles.modalMeta}>
                  <p><strong style={styles.modalStrong}>Category:</strong> {selectedProduct.category}</p>
                  <p style={selectedProduct.inStock ? styles.inStock : styles.outOfStock}>
                    <strong>Availability:</strong> {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>

                {/* Features */}
                <div style={styles.featuresSection}>
                  <h4 style={styles.featuresTitle}>Key Features:</h4>
                  <div style={styles.featuresGrid}>
                    {selectedProduct.features.map((feature, index) => (
                      <div key={index} style={styles.featureItem}>
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={styles.descriptionSection}>
                  <h4 style={styles.descriptionTitle}>Product Description:</h4>
                  <p style={styles.modalDescription}>{selectedProduct.description}</p>
                </div>

                {/* Action Buttons */}
                <div style={styles.modalButtonGroup}>
                  <button
                    style={{
                      ...styles.buyNowButton,
                      opacity: selectedProduct.inStock ? 1 : 0.5,
                      cursor: selectedProduct.inStock ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => selectedProduct.inStock && handleBuyNow(selectedProduct)}
                    disabled={!selectedProduct.inStock}
                  >
                    {selectedProduct.inStock ? 'Proceed to Buy' : 'Out of Stock'}
                  </button>
                  <button
                    style={styles.continueShoppingButton}
                    onClick={() => setSelectedProduct(null)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ... (styles remain exactly the same as previous code)
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#000",
    color: "#e0f7fa",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#06b6d4",
    fontSize: "2.5rem",
    fontWeight: "700",
    textShadow: "0 2px 10px rgba(6, 182, 212, 0.3)",
  },
  searchFilterContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  resultsCount: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "20px",
    fontSize: "14px",
  },
  searchBox: {
    position: "relative",
    minWidth: "300px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: "18px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px 12px 45px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "2px solid #1e293b",
    backgroundColor: "#0f172a",
    color: "#e0f7fa",
    outline: "none",
    transition: "all 0.3s ease",
  },
  categorySelect: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "2px solid #1e293b",
    backgroundColor: "#0f172a",
    color: "#e0f7fa",
    minWidth: "200px",
    outline: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "linear-gradient(145deg, #0f172a, #1e293b)",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    border: "1px solid #1e293b",
  },
  imageContainer: {
    position: "relative",
    height: "220px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  discountBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    color: "#0f172a",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(6, 182, 212, 0.3)",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff5e57",
    fontSize: "18px",
    fontWeight: "bold",
  },
  cardContent: {
    padding: "20px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e0f7fa",
    margin: 0,
    lineHeight: "1.3",
  },
  categoryText: {
    fontSize: "14px",
    color: "#06b6d4",
    fontWeight: "500",
    margin: 0,
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  stars: {
    display: "flex",
    gap: "2px",
  },
  ratingText: {
    fontSize: "14px",
    color: "#06b6d4",
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: "12px",
    color: "#64748b",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  price: {
    fontSize: "20px",
    color: "#06b6d4",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: "16px",
    color: "#64748b",
    textDecoration: "line-through",
  },
  discountPrice: {
    fontSize: "20px",
    color: "#06b6d4",
    fontWeight: "bold",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  featureTag: {
    fontSize: "12px",
    color: "#94a3b8",
    background: "rgba(6, 182, 212, 0.1)",
    padding: "4px 8px",
    borderRadius: "12px",
    display: "inline-block",
    width: "fit-content",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  detailsButton: {
    backgroundColor: "transparent",
    color: "#06b6d4",
    border: "2px solid #06b6d4",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    flex: 1,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  buyButton: {
    backgroundColor: "#06b6d4",
    color: "#0f172a",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    flex: 1,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    background: "linear-gradient(145deg, #0f172a, #1e293b)",
    color: "#e0f7fa",
    borderRadius: "20px",
    maxWidth: "900px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    border: "1px solid #334155",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  closeModalButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(255, 94, 87, 0.9)",
    color: "#0f172a",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 1001,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  modalLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    padding: "40px",
  },
  modalImageSection: {
    position: "relative",
  },
  modalImage: {
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
  modalDiscountBadge: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    color: "#0f172a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(6, 182, 212, 0.4)",
  },
  modalDetailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalTitle: {
    color: "#e0f7fa",
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
    lineHeight: "1.2",
  },
  modalRating: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  modalRatingText: {
    fontSize: "16px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  modalPriceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  modalPrice: {
    fontSize: "32px",
    color: "#06b6d4",
    fontWeight: "bold",
  },
  modalOriginalPrice: {
    fontSize: "20px",
    color: "#64748b",
    textDecoration: "line-through",
  },
  modalDiscountPrice: {
    fontSize: "32px",
    color: "#06b6d4",
    fontWeight: "bold",
  },
  modalMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modalStrong: {
    color: "#06b6d4",
  },
  inStock: {
    color: "#4ade80",
    fontWeight: "500",
  },
  outOfStock: {
    color: "#ff5e57",
    fontWeight: "500",
  },
  featuresSection: {
    marginTop: "10px",
  },
  featuresTitle: {
    color: "#06b6d4",
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "600",
  },
  featuresGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  featureItem: {
    padding: "8px 12px",
    color: "#e0f7fa",
    fontSize: "14px",
    background: "rgba(6, 182, 212, 0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(6, 182, 212, 0.2)",
  },
  descriptionSection: {
    marginTop: "10px",
  },
  descriptionTitle: {
    color: "#06b6d4",
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "600",
  },
  modalDescription: {
    lineHeight: "1.6",
    fontSize: "15px",
    color: "#cbd5e1",
    margin: 0,
  },
  modalButtonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "auto",
  },
  buyNowButton: {
    backgroundColor: "#06b6d4",
    color: "#0f172a",
    border: "none",
    padding: "16px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
  },
  continueShoppingButton: {
    backgroundColor: "transparent",
    color: "#06b6d4",
    border: "2px solid #06b6d4",
    padding: "16px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
};

export default ProductFilter;