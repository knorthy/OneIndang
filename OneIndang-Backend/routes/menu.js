const express = require('express');
const { param, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ==================== MENU DATA ====================
// This matches your existing local menu data in order.jsx
// In the future, you can migrate this to the database

const RESTAURANT_MENUS = {
  "Jollibee Indang": [
    { id: 'j1', category: 'Best Sellers', name: 'Chickenjoy - 1pc w/ Rice', price: 99.00, img: 'chickenjoy.png' },
    { id: 'j2', category: 'Best Sellers', name: 'Jolly Spaghetti', price: 60.00, img: 'spaghetti.png' },
    { id: 'j3', category: 'Burgers', name: 'Yumburger', price: 45.00, img: 'yumburger.png' },
    { id: 'j4', category: 'Burgers', name: 'Cheesy Yumburger', price: 65.00, img: 'yumburger.png' },
    { id: 'j5', category: 'Sandwiches', name: 'Jolly Hotdog', price: 85.00, img: 'hotdog.png' },
    { id: 'j6', category: 'Dessert', name: 'Peach Mango Pie', price: 48.00, img: 'pie.png' },
    { id: 'j7', category: 'Buckets', name: 'Chickenjoy Bucket (6pcs)', price: 499.00, img: 'bucket.png' },
  ],
  "Siglo Farm Café": [
    { id: 's1', category: 'Coffee', name: 'Barako Brew', price: 120.00, img: 'coffee.png' },
    { id: 's2', category: 'Coffee', name: 'Iced Caramel Macchiato', price: 150.00, img: 'macchiato.png' },
    { id: 's3', category: 'Mains', name: 'Siglo Salad', price: 220.00, img: 'salad.png' },
    { id: 's4', category: 'Mains', name: 'Chicken Adobo w/ Red Rice', price: 280.00, img: 'adobo.png' },
    { id: 's5', category: 'Tea', name: 'Fresh Herbal Tea (Tarragon)', price: 90.00, img: 'tea.png' },
  ],
  "Celyns Inasal": [
    { id: 'c1', category: 'Inasal', name: 'Paa (Leg) w/ Unli Rice', price: 135.00, img: 'inasal.png' },
    { id: 'c2', category: 'Inasal', name: 'Pecho (Breast) w/ Unli Rice', price: 145.00, img: 'inasal.png' },
  ],
  "Indang Town Milk Tea": [
    { id: 'm1', category: 'Milk Tea', name: 'Pearl Milk Tea (Large)', price: 95.00, img: 'milktea.png' },
  ],
  "Kusina ni Lolo": [
    { id: 'k1', category: 'Soup', name: 'Special Bulalo (Good for 3)', price: 650.00, img: 'bulalo.png' },
  ]
};

const DEFAULT_MENU = RESTAURANT_MENUS["Jollibee Indang"];

/**
 * GET /api/menu
 * Get all available restaurant menus
 */
router.get('/', async (req, res) => {
  try {
    const restaurants = Object.keys(RESTAURANT_MENUS).map(name => ({
      name,
      itemCount: RESTAURANT_MENUS[name].length
    }));
    
    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/menu/:restaurantName
 * Get menu for a specific restaurant
 */
router.get('/:restaurantName', async (req, res) => {
  try {
    const { restaurantName } = req.params;
    const decodedName = decodeURIComponent(restaurantName);
    
    // Try exact match first
    let menu = RESTAURANT_MENUS[decodedName];
    
    // If no exact match, try partial match
    if (!menu) {
      const key = Object.keys(RESTAURANT_MENUS).find(k => 
        decodedName.toLowerCase().includes(k.toLowerCase()) || 
        k.toLowerCase().includes(decodedName.toLowerCase())
      );
      menu = key ? RESTAURANT_MENUS[key] : DEFAULT_MENU;
    }
    
    // Get unique categories
    const categories = [...new Set(menu.map(item => item.category))];
    
    res.json({
      success: true,
      data: {
        restaurant: decodedName,
        categories,
        items: menu
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/menu/:restaurantName/category/:category
 * Get menu items by category for a restaurant
 */
router.get('/:restaurantName/category/:category', async (req, res) => {
  try {
    const { restaurantName, category } = req.params;
    const decodedName = decodeURIComponent(restaurantName);
    const decodedCategory = decodeURIComponent(category);
    
    let menu = RESTAURANT_MENUS[decodedName];
    
    if (!menu) {
      const key = Object.keys(RESTAURANT_MENUS).find(k => 
        decodedName.toLowerCase().includes(k.toLowerCase()) || 
        k.toLowerCase().includes(decodedName.toLowerCase())
      );
      menu = key ? RESTAURANT_MENUS[key] : DEFAULT_MENU;
    }
    
    const filteredItems = menu.filter(item => 
      item.category.toLowerCase() === decodedCategory.toLowerCase()
    );
    
    res.json({
      success: true,
      data: {
        restaurant: decodedName,
        category: decodedCategory,
        items: filteredItems
      }
    });
  } catch (error) {
    console.error('Error fetching menu by category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
