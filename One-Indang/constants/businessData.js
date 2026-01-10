// Business Data Constants
// This file contains all data sets used across business-related screens

// Main Business Categories (from business.jsx)
export const BUSINESS_CATEGORIES = [
  { id: '1', name: 'Agriculture', img: 'https://cdn-icons-png.flaticon.com/512/2610/2610368.png', route: '/agri' },
  { id: '2', name: 'Food', img: 'https://cdn-icons-png.flaticon.com/512/732/732217.png', route: '/foodtripind' },
  { id: '3', name: 'Tourism', img: 'https://cdn-icons-png.flaticon.com/512/2560/2560421.png', route: '/tourismindang' },
  { id: '4', name: 'Retail', img: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', route: '/retailindang' },
  { id: '5', name: 'Transport', img: 'https://cdn-icons-png.flaticon.com/512/1048/1048314.png', route: '/transport' },
  { id: '6', name: 'Education', img: 'https://cdn-icons-png.flaticon.com/512/3976/3976625.png', route: '/education' },
  { id: '7', name: 'Construction', img: 'https://cdn-icons-png.flaticon.com/512/4327/4327376.png', route: '/construction' },
  { id: '8', name: 'Services', img: 'https://cdn-icons-png.flaticon.com/512/1067/1067561.png', route: '/serviceindang' },
];

// Popular Businesses Data (from business.jsx)
export const POPULAR_BUSINESSES = [
  { id: '1', name: 'Jollibee Indang', category: 'Food', address: 'Town Plaza', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', isOpen: true, price: '$1,200', beds: 'N/A', baths: '2', sqft: '1,200' },
  { id: '2', name: 'Siglo Farm Café', category: 'Food / Agri', address: 'Kayquit 3', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', isOpen: false, price: '$800', beds: 'N/A', baths: '1', sqft: '800' },
  { id: '3', name: 'Woodland Apartment', category: 'Apartment', address: 'Poblacion', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isOpen: true, price: '$1,500', beds: '3', baths: '1', sqft: '1,848' },
];

// Business Setup Timeline (from business.jsx)
export const BUSINESS_SETUP_STAGES = [
  { id: '1', title: 'BUSINESS REGISTRATION', description: 'Apply for DTI/SEC registration online.' },
  { id: '2', title: 'LAND DEVELOPMENT', description: 'Verify zoning and obtain Planning Office clearance.' },
  { id: '3', title: 'FACILITY CONSTRUCTION', description: 'Secure building permits and comply with safety codes.' },
  { id: '4', title: 'FINAL OPERATION', description: 'Register with BIR and secure Mayor\'s Permit.' },
];

// Food Data (from foodtripind.jsx)
export const FOOD_DATA = [
  { id: '1', name: 'Jollibee Indang', sub: 'Fast Food • Town Plaza', rating: '4.8', distance: '0.2 km', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', verified: true, location: 'Indang Town Plaza', tag: 'Popular', category: 'Fast Food', price: '250', capacity: '100+', time: '24/7', agent: 'Manager On Duty' },
  { id: '2', name: 'Siglo Farm Café', sub: 'Native Coffee • Filipino Fusion', rating: '4.9', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', verified: true, location: 'Brgy. Kaytapos', tag: 'Must Try', category: 'Cafes', price: '450', capacity: '40', time: '8AM-9PM', agent: 'Chef Aris' },
  { id: '3', name: 'Celyns Inasal', sub: 'Grilled Chicken • Local Favorites', rating: '4.6', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', verified: false, location: 'San Gregorio St.', tag: 'Trending', category: 'Native', price: '180', capacity: '60', time: '10AM-8PM', agent: 'Celyn S.' },
  { id: '4', name: 'Indang Town Milk Tea', sub: 'Refreshments • Snacks', rating: '4.5', distance: '0.3 km', image: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=500', verified: false, location: 'Poblacion 1', tag: 'Best Seller', category: 'Desserts', price: '95', capacity: '15', time: '11AM-7PM', agent: 'Store Lead' },
  { id: '5', name: 'Kusina ni Lolo', sub: 'Authentic Bulalo & Sinigang', rating: '4.7', distance: '2.1 km', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500', verified: true, location: 'Brgy. Alulod', tag: 'Top Rated', category: 'Native', price: '600', capacity: '80', time: '9AM-10PM', agent: 'Lolo Bert' },
];

// Education Data (from education.jsx)
export const EDUCATION_BASE_DATA = [
  { id: '1', name: 'Cavite State University', sub: 'Main Campus • Public University', rating: '4.9', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=400', tag: 'Govt Accredited', verified: true, category: 'University', location: 'Indang-Mendez Rd', price: '0', beds: '50+', baths: '20+', sqft: '15,000+', agent: 'Registrar Office', phone: '0461234567' },
  { id: '2', name: 'Indang Central School', sub: 'Elementary • Public Education', rating: '4.6', distance: '0.3 km', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', tag: 'Historical', verified: false, category: 'Primary', location: 'Poblacion', price: '0', beds: '24', baths: '8', sqft: '2,500', agent: 'Principal Office', phone: '0467654321' },
  { id: '3', name: 'St. Gregory Academy', sub: 'Private • K-12 School', rating: '4.7', distance: '0.4 km', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', tag: 'Top Rated', verified: true, category: 'Secondary', location: 'Poblacion 2', price: '15,000', beds: '30', baths: '12', sqft: '4,000', agent: 'Admissions', phone: '09112223333' },
  { id: '4', name: 'Indang National High School', sub: 'Public • Secondary Education', rating: '4.5', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', tag: 'Public', verified: false, category: 'Secondary', location: 'Brgy. Alulod', price: '0', beds: '40', baths: '10', sqft: '6,000', agent: 'Admin Sec', phone: '09998887777' },
];

export const EDUCATION_INSTITUTIONS = [
  ...EDUCATION_BASE_DATA,
  { ...EDUCATION_BASE_DATA[0], id: '5', name: 'Cavite East Campus', location: 'Brgy. Bancod' },
  { ...EDUCATION_BASE_DATA[2], id: '6', name: 'Saint Thomas School', location: 'Brgy. Mataas na Lupa' },
  { ...EDUCATION_BASE_DATA[3], id: '7', name: 'Lumampong High', location: 'Brgy. Lumampong' },
  { ...EDUCATION_BASE_DATA[1], id: '8', name: 'Buna Elem. School', location: 'Brgy. Buna' },
];

export const EDUCATION_FILTERS = ['All', 'University', 'Secondary', 'Primary', 'Vocational'];

export const EDUCATION_GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
  'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=400',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
];

export const EDUCATION_REVIEWS_DATA = [
  { id: 1, user: 'Juan Dela Cruz', rating: 5, comment: 'Best university in Cavite! Very spacious campus.', date: '1 month ago' },
  { id: 2, user: 'Sarah L.', rating: 4, comment: 'Great teachers but traffic during rush hour.', date: '3 weeks ago' },
];

// Construction Data (from construction.jsx)
export const CONSTRUCTION_BASE_DATA = [
  { id: '1', name: 'Indang Mega Hardware', sub: 'Steel, Cement & Power Tools', rating: '4.8', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400', tag: 'Complete Stocks', verified: true, category: 'Hardware', location: 'Poblacion 4', price: '2,500', beds: '0', baths: '2', sqft: '4,500', agent: 'Engr. Santos', phone: '09123456789' },
  { id: '2', name: 'Cavite Concrete Master', sub: 'Ready-mix & Aggregates', rating: '4.7', distance: '2.1 km', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400', tag: 'Contractor', verified: true, category: 'Contractors', location: 'Brgy. Alulod', price: '15,000', beds: '0', baths: '1', sqft: '10,000', agent: 'Lando Cal', phone: '09987654321' },
  { id: '3', name: 'J.M. De Villa Engineering', sub: 'Structural Design & Permits', rating: '4.9', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400', tag: 'Licensed', verified: true, category: 'Engineering', location: 'Poblacion 1', price: '5,000', beds: '4', baths: '2', sqft: '1,800', agent: 'Joey De Villa', phone: '09112223333' },
  { id: '4', name: 'Poblacion Paint Center', sub: 'Mixing & Finishing Supplies', rating: '4.6', distance: '0.3 km', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400', tag: 'Premium', verified: false, category: 'Paints', location: 'Poblacion 3', price: '800', beds: '0', baths: '0', sqft: '120', agent: 'Tina Tints', phone: '09223334444' },
];

export const CONSTRUCTION_BUSINESSES = [
  ...CONSTRUCTION_BASE_DATA,
  { ...CONSTRUCTION_BASE_DATA[0], id: '5', name: 'Indang Glass & Aluminum', location: 'Brgy. Kayquit' },
  { ...CONSTRUCTION_BASE_DATA[1], id: '6', name: 'Solid Rock Aggregates', location: 'Brgy. Banaba' },
  { ...CONSTRUCTION_BASE_DATA[2], id: '7', name: 'ArkiTeck Design', location: 'Brgy. Bancod' },
  { ...CONSTRUCTION_BASE_DATA[3], id: '8', name: 'Color World Paints', location: 'Poblacion 2' },
];

export const CONSTRUCTION_FILTERS = ['All', 'Hardware', 'Contractors', 'Engineering', 'Equipment', 'Paints'];

export const CONSTRUCTION_GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
  'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=400',
];

export const CONSTRUCTION_REVIEWS_DATA = [
  { id: 1, user: 'Engr. Michael', rating: 5, comment: 'Complete stocks and very fast delivery.', date: '2 days ago' },
  { id: 2, user: 'Home Builder 101', rating: 4, comment: 'Good quality sand and gravel, but parking is tight.', date: '1 week ago' },
];

// Agriculture Data (from [agri].jsx)
export const AGRICULTURE_BASE_DATA = [
  { id: '1', name: 'Indang Farm Heritage', category: 'Agriculture', sub: 'Organic Vegetables & Tours', rating: '4.9', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400', verified: true, location: 'Brgy. Mataas na Lupa', tag: 'Popular', type: 'Farms', price: '500', sqft: '5,000', agent: 'Farmer Jun', phone: '09123456789' },
  { id: '2', name: 'Silan Dragon Fruit Farm', category: 'Agriculture', sub: 'Pick-and-Pay Fruit Orchard', rating: '4.8', distance: '3.1 km', image: 'https://images.unsplash.com/photo-1527333323140-79886a8969bb?w=400', verified: true, location: 'Brgy. Tambo Munti', tag: 'Must Try', type: 'Produce', price: '300', sqft: '10,000', agent: 'Ms. Silan', phone: '09987654321' },
  { id: '3', name: 'EMV Flower Farm', category: 'Agriculture', sub: 'Ornamental Flowers & Events', rating: '4.7', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400', verified: true, location: 'Sitio Colong', tag: 'Trending', type: 'Farms', price: '450', sqft: '7,500', agent: 'Admin Rose', phone: '09112223333' },
];

export const AGRICULTURE_DATA = [
  ...AGRICULTURE_BASE_DATA,
  { ...AGRICULTURE_BASE_DATA[0], id: '4', name: 'Cavite Green House', location: 'Brgy. Buna Lejos' },
  { ...AGRICULTURE_BASE_DATA[1], id: '5', name: 'Harvest Moon Fields', location: 'Brgy. Kayquit' },
  { ...AGRICULTURE_BASE_DATA[2], id: '6', name: 'Sunny Side Orchards', location: 'Brgy. Alulod' },
  { ...AGRICULTURE_BASE_DATA[0], id: '7', name: 'Indang Eco Park', location: 'Poblacion' },
  { ...AGRICULTURE_BASE_DATA[1], id: '8', name: 'Buna Lejos Agri', location: 'Brgy. Buna' },
];

export const AGRICULTURE_FILTERS = ['All', 'Farms', 'Produce', 'Services', 'Suppliers'];

export const AGRICULTURE_GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
  'https://images.unsplash.com/photo-1625246333195-58197bd4773d?w=400',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
  'https://images.unsplash.com/photo-1527333323140-79886a8969bb?w=400',
];

export const AGRICULTURE_REVIEWS_DATA = [
  { id: 1, user: 'Maria Santos', rating: 5, comment: 'Sobrang ganda ng place! Fresh air and fresh veggies.', date: '2 days ago' },
  { id: 2, user: 'John Doe', rating: 4, comment: 'Nice experience but the road going there is a bit narrow.', date: '1 week ago' },
  { id: 3, user: 'Anna Cruz', rating: 5, comment: 'Very accomodating staff and the dragon fruit shake is a must try!', date: '3 weeks ago' },
];

// Retail Data (from retailindang.jsx)
export const RETAIL_BASE_DATA = [
  { id: '1', name: 'Indang Town Center', sub: 'Department Store & Groceries', rating: '4.7', distance: '0.2 km', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', tag: 'One Stop Shop', verified: true, category: 'Department', location: 'Poblacion 1', price: '1,200', beds: '0', baths: '4', sqft: '8,000', agent: 'Store Manager', phone: '09123456789' },
  { id: '2', name: 'Fresh Market Indang', sub: 'Local Produce & Meat Market', rating: '4.6', distance: '0.4 km', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', tag: 'Fresh Daily', verified: true, category: 'Market', location: 'Poblacion 3', price: '800', beds: '0', baths: '2', sqft: '3,500', agent: 'Market Admin', phone: '09987654321' },
  { id: '3', name: 'Indang Fashion Hub', sub: 'Clothing & Accessories', rating: '4.5', distance: '0.3 km', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', tag: 'Latest Trends', verified: false, category: 'Fashion', location: 'Poblacion 2', price: '500', beds: '0', baths: '1', sqft: '1,200', agent: 'Owner Tina', phone: '09112223333' },
  { id: '4', name: 'Tech World Indang', sub: 'Electronics & Gadgets', rating: '4.8', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', tag: 'Best Prices', verified: true, category: 'Electronics', location: 'Poblacion 4', price: '2,000', beds: '0', baths: '1', sqft: '2,500', agent: 'Tech Support', phone: '09223334444' },
];

export const RETAIL_REVIEWS_DATA = [
  { id: 1, user: 'Shopping Queen', rating: 5, comment: 'Complete shopping experience! Everything under one roof.', date: '1 day ago' },
  { id: 2, user: 'Local Buyer', rating: 4, comment: 'Good selection but parking can be crowded during weekends.', date: '3 days ago' },
];

// Tourism Data (from tourismindang.jsx)
export const TOURISM_BASE_DATA = [
  { id: '1', name: 'Indang Heritage Museum', sub: 'Historical Artifacts & Culture', rating: '4.8', distance: '0.3 km', image: 'https://images.unsplash.com/photo-1566127992631-137a41c5b5da?w=400', tag: 'Cultural Hub', verified: true, category: 'Museums', location: 'Poblacion 1', price: '50', beds: '0', baths: '2', sqft: '2,000', agent: 'Curator Maria', phone: '09123456789' },
  { id: '2', name: 'Mt. Pico de Loro Viewpoint', sub: 'Scenic Mountain Views', rating: '4.9', distance: '8.5 km', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', tag: 'Breathtaking', verified: true, category: 'Nature', location: 'Maragondon', price: '100', beds: '0', baths: '0', sqft: 'N/A', agent: 'Tour Guide', phone: '09987654321' },
  { id: '3', name: 'Indang River Adventure', sub: 'Kayaking & River Tours', rating: '4.7', distance: '2.1 km', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', tag: 'Adventure', verified: true, category: 'Adventure', location: 'Brgy. Alulod', price: '300', beds: '0', baths: '1', sqft: '500', agent: 'Adventure Co.', phone: '09112223333' },
  { id: '4', name: 'Casa de Indang Resort', sub: 'Luxury Resort & Spa', rating: '4.6', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', tag: 'Relaxation', verified: false, category: 'Resorts', location: 'Brgy. Kayquit', price: '2,500', beds: '20', baths: '15', sqft: '5,000', agent: 'Front Desk', phone: '09223334444' },
];

export const TOURISM_DATA = [
  ...TOURISM_BASE_DATA,
  { ...TOURISM_BASE_DATA[0], id: '5', name: 'Indang Church Tour', location: 'Poblacion' },
  { ...TOURISM_BASE_DATA[1], id: '6', name: 'Hidden Falls Trek', location: 'Brgy. Bancod' },
  { ...TOURISM_BASE_DATA[2], id: '7', name: 'Bamboo Rafting', location: 'Brgy. Buna' },
  { ...TOURISM_BASE_DATA[3], id: '8', name: 'Mountain Resort', location: 'Brgy. Mataas na Lupa' },
];