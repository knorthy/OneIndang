// Student data constants for the student housing and scholarship app

export const STUDENT_CATEGORIES = [
  { id: 1, name: 'House', icon: 'home' },
  { id: 2, name: 'Bed Space', icon: 'bed' },
  { id: 3, name: 'Apartment', icon: 'building' },
  { id: 4, name: 'Scholarship', icon: 'graduation-cap' },
];

export const STUDENT_PROPERTIES = [
  // HOUSES
  { id: 101, title: 'Sunrise Family Home', location: 'Poblacion 1, Indang', price: '15,000', rating: 4.7, type: 'House', image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '3 Bedroom, 2 Bath, Garage', beds: 3, baths: 2, sqft: '1,848' },
  { id: 102, title: 'Casa Verde Bungalow', location: 'Bancod, Indang', price: '12,500', rating: 4.5, type: 'House', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '2 Bedroom, Garden', beds: 2, baths: 1, sqft: '1,200' },
  { id: 103, title: 'Villa Alfonso Rental', location: 'Kaytapos, Indang', price: '18,000', rating: 4.8, type: 'House', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Fully Furnished', beds: 4, baths: 3, sqft: '2,100' },
  { id: 104, title: 'Metrogate Indang', location: 'Alulod, Indang', price: '20,000', rating: 4.9, type: 'House', image: 'https://images.unsplash.com/photo-1600596542815-22b8c36002ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80', details: 'Secure Subdivision', beds: 3, baths: 2, sqft: '1,500' },
  { id: 105, title: 'Cozy Bamboo Retreat', location: 'Buna Lejos, Indang', price: '8,000', rating: 4.3, type: 'House', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Native style', beds: 1, baths: 1, sqft: '600' },
  { id: 106, title: 'Poblacion Townhouse', location: 'Poblacion 3, Indang', price: '14,000', rating: 4.6, type: 'House', image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1678&q=80', details: '2 Storey, 2 BR', beds: 2, baths: 2, sqft: '900' },
  { id: 107, title: 'Hidden Haven Villa', location: 'Calumpang, Indang', price: '25,000', rating: 5.0, type: 'House', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Pool access', beds: 4, baths: 4, sqft: '3,000' },
  { id: 108, title: 'Blue Roof Cottage', location: 'Mataas na Lupa, Indang', price: '10,000', rating: 4.4, type: 'House', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Quiet neighborhood', beds: 2, baths: 1, sqft: '800' },
  { id: 109, title: 'Modern Minimalist', location: 'Poblacion 4, Indang', price: '16,500', rating: 4.7, type: 'House', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', details: 'Newly renovated', beds: 2, baths: 1, sqft: '1,100' },
  { id: 110, title: 'Farm View House', location: 'Tambo Kulit, Indang', price: '9,500', rating: 4.5, type: 'House', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Scenic view', beds: 2, baths: 1, sqft: '950' },

  // BED SPACES
  { id: 201, title: 'Lola Fely\'s Dormitory', location: 'Near CvSU Main', price: '1,500', rating: 4.8, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', details: 'Female only', beds: 1, baths: 1, sqft: 'N/A' },
  { id: 202, title: 'CvSU Student Lodge', location: 'Bancod, Indang', price: '1,800', rating: 4.2, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1478&q=80', details: 'Walking distance', beds: 1, baths: 2, sqft: 'N/A' },
  { id: 203, title: 'SHO Dormitory', location: 'Rough Road, Indang', price: '2,000', rating: 4.9, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Airconditioned', beds: 1, baths: 1, sqft: 'N/A' },
  { id: 204, title: 'Green House Boarding', location: 'Poblacion 2, Indang', price: '1,200', rating: 4.0, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1467&q=80', details: 'Fan room', beds: 1, baths: 2, sqft: 'N/A' },
  { id: 205, title: 'Indang Scholars Dorm', location: 'Kaytapos, Indang', price: '2,500', rating: 4.6, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1518&q=80', details: 'Inclusive utils', beds: 1, baths: 1, sqft: 'N/A' },
  { id: 206, title: 'Nanay Esther\'s Place', location: 'Bancod, Indang', price: '1,600', rating: 4.7, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', details: 'Meals avail', beds: 1, baths: 1, sqft: 'N/A' },
  { id: 207, title: 'St. Thomas Hall', location: 'San Gregorio, Indang', price: '3,000', rating: 4.5, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Premium solo', beds: 1, baths: 1, sqft: 'N/A' },
  { id: 208, title: 'Happy Students Home', location: 'Poblacion 1, Indang', price: '1,500', rating: 4.3, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', details: '4 pax/room', beds: 1, baths: 2, sqft: 'N/A' },
  { id: 209, title: 'Yellow Gate Boarding', location: 'Bancod, Indang', price: '1,300', rating: 4.1, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80', details: 'Budget friendly', beds: 1, baths: 2, sqft: 'N/A' },
  { id: 210, title: 'Cristian Jay Dorm', location: 'Near 7-11 Indang', price: '2,200', rating: 4.4, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Male quarters', beds: 1, baths: 2, sqft: 'N/A' },

  // APARTMENTS
  { id: 301, title: 'Woodland Apartments', location: 'Rough Road, Indang', price: '5,500', rating: 4.5, type: 'Apartment', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Studio Type', beds: 1, baths: 1, sqft: '500' },
  { id: 302, title: 'Poblacion Heights', location: 'Poblacion 4, Indang', price: '7,000', rating: 4.6, type: 'Apartment', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80', details: '1 BR, Balcony', beds: 1, baths: 1, sqft: '700' },
  { id: 303, title: 'CvSU Gate 2 Apts', location: 'Bancod, Indang', price: '4,500', rating: 4.3, type: 'Apartment', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Unfurnished', beds: 1, baths: 1, sqft: '400' },
  { id: 304, title: 'Indang Ridge Flats', location: 'Alulod, Indang', price: '6,500', rating: 4.7, type: 'Apartment', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Gated compound', beds: 1, baths: 1, sqft: '600' },
  { id: 305, title: 'San Gregorio Studio', location: 'San Gregorio, Indang', price: '3,800', rating: 4.0, type: 'Apartment', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Solo unit', beds: 1, baths: 1, sqft: '350' },
  { id: 306, title: 'Mahogany Place', location: 'Mahogany Ave', price: '8,000', rating: 4.9, type: 'Apartment', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '2 BR, WiFi', beds: 2, baths: 1, sqft: '800' },
  { id: 307, title: 'Bancod River View', location: 'Bancod, Indang', price: '5,000', rating: 4.4, type: 'Apartment', image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Scenic, quiet', beds: 1, baths: 1, sqft: '550' },
  { id: 308, title: 'Town Plaza Apts', location: 'Near Plaza, Indang', price: '6,000', rating: 4.5, type: 'Apartment', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Accessible', beds: 1, baths: 1, sqft: '600' },
  { id: 309, title: 'White House Units', location: 'Kaytapos, Indang', price: '4,000', rating: 4.2, type: 'Apartment', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Water pump', beds: 1, baths: 1, sqft: '400' },
  { id: 310, title: 'East Wood Rental', location: 'Buna Cerca, Indang', price: '5,500', rating: 4.3, type: 'Apartment', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Studio w/ loft', beds: 1, baths: 1, sqft: '500' },

  // SCHOLARSHIPS
  { id: 401, title: 'CvSU Academic', location: 'Cavite State U', price: 'Full', rating: 5.0, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Dean\'s List', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 402, title: 'Provincial Schol', location: 'Provincial Gov', price: 'Grant', rating: 4.9, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Local Gov', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 403, title: 'DOST-SEI', location: 'Indang, Cavite', price: 'Stipend', rating: 5.0, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Sci & Tech', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 404, title: 'CHED Tulong Dunong', location: 'Indang, Cavite', price: 'Assist', rating: 4.7, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Financial Aid', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 405, title: 'LGU Indang Schol', location: 'Municipal Hall', price: 'Varies', rating: 4.6, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Residents', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 406, title: 'CvSU Sports Schol', location: 'Cavite State U', price: 'Full', rating: 4.8, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Athletes', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 407, title: 'Student Assistant', location: 'CvSU Main', price: 'Wage', rating: 4.5, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Work-study', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 408, title: 'OWWA Scholarship', location: 'Cavite Region', price: 'Grant', rating: 4.7, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1349&q=80', details: 'OFW Dep', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 409, title: 'Cebuana Schol', location: 'Indang Branches', price: 'Grant', rating: 4.4, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'ALS', beds: 0, baths: 0, sqft: 'N/A' },
  { id: 410, title: 'Rotary Club Grant', location: 'Rotary Indang', price: 'Books', rating: 4.3, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1577896335477-2858506f48db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Allowance', beds: 0, baths: 0, sqft: 'N/A' },
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
];

export const MOCK_REVIEWS = [
  { id: 1, name: 'Alice Smith', rating: 5, date: 'Jan 10, 2026', comment: 'Beautiful place! Very accessible to CvSU. Highly recommended.' },
  { id: 2, name: 'Mark D.', rating: 4, date: 'Dec 05, 2025', comment: 'Quiet and safe neighborhood. The landlord is very approachable.' },
  { id: 3, name: 'Sarah Joy', rating: 5, date: 'Nov 22, 2025', comment: 'Best boarding house I stayed in Indang so far. Fast WiFi!' },
];