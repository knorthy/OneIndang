# One Indang Backend

Express.js backend server for the One Indang mobile app. This server complements Supabase, providing custom API endpoints while using Supabase for authentication and database storage.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (handled by frontend)

## Features

- 🏪 **Business CRUD** - Create, Read, Update, Delete businesses
- 📦 **Order Management** - Create and track orders stored in database
- 🍽️ **Menu API** - Restaurant menu data endpoints
- 🔒 **Security** - Helmet, CORS, Rate limiting
- ✅ **Validation** - express-validator for input validation

## Project Structure

```
OneIndang-Backend/
├── config/
│   └── supabase.js       # Supabase client configuration
├── database/
│   └── schema.sql        # Database tables and seed data
├── middleware/
│   └── auth.js           # Authentication middleware
├── routes/
│   ├── business.js       # Business CRUD endpoints
│   ├── orders.js         # Order management endpoints
│   └── menu.js           # Menu data endpoints
├── utils/
│   └── helpers.js        # Utility functions
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── server.js             # Main server entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd OneIndang-Backend
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:8081
```

> **Note**: Get your Supabase credentials from:
> Project Settings → API → Project URL and service_role key

### 3. Setup Database Tables

Run the SQL schema in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `database/schema.sql`
4. Run the query

This creates:
- `businesses` table with sample data
- `orders` table for order storage
- `order_items` table for order details
- Required indexes and RLS policies

### 4. Start the Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Businesses
- `GET /api/business` - Get all businesses (with filters)
- `GET /api/business/:id` - Get business by ID
- `GET /api/business/categories` - Get all categories
- `GET /api/business/category/:category` - Get by category
- `POST /api/business` - Create business
- `PUT /api/business/:id` - Update business
- `DELETE /api/business/:id` - Delete business

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user's orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Menu
- `GET /api/menu` - Get all restaurants
- `GET /api/menu/:restaurantName` - Get restaurant menu
- `GET /api/menu/:restaurantName/category/:category` - Get by category

## Usage Examples

### Get All Businesses
```bash
curl http://localhost:5000/api/business
```

### Get Businesses by Category
```bash
curl http://localhost:5000/api/business?category=Food
```

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_name": "Jollibee Indang",
    "total_amount": 163.00,
    "delivery_address": "Poblacion 1, Indang",
    "payment_method": "Cash",
    "items": [
      {"name": "Chickenjoy", "price": 99.00, "qty": 1},
      {"name": "Jolly Spaghetti", "price": 60.00, "qty": 1}
    ]
  }'
```

## Frontend Integration

The React Native app uses the API service in `One-Indang/services/api.js`:

```javascript
import { ordersAPI, businessAPI } from '../services/api';

// Create order
const response = await ordersAPI.create(orderData);

// Get businesses
const businesses = await businessAPI.getAll({ category: 'Food' });
```

## Environment Variables for Expo App

Add to your `.env` in the `One-Indang/` folder:

```env
# Add this line to connect to your Express backend
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api
```

For Expo development, use your computer's local IP (e.g., `192.168.1.100`) instead of `localhost`.

## Notes

- **Authentication** remains with Supabase - the frontend handles login/signup directly
- **Orders** are now persisted in the database instead of local state only
- **Businesses** can be managed via API (future admin panel)
- The app works offline with fallback to local storage if API is unavailable

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)

## License

MIT
