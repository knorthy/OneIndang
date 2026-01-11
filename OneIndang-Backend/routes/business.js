const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
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

// ==================== CRUD OPERATIONS ====================

/**
 * GET /api/business
 * Get all businesses with optional filtering
 * Query params: category, search, limit, offset
 */
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt()
], validate, async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    let queryBuilder = supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filter by category if provided
    if (category && category !== 'All') {
      queryBuilder = queryBuilder.eq('category', category);
    }
    
    // Search by name if provided
    if (search) {
      queryBuilder = queryBuilder.ilike('name', `%${search}%`);
    }
    
    const { data, error, count } = await queryBuilder;
    
    if (error) throw error;
    
    res.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + data.length < count
      }
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/business/categories
 * Get all unique business categories
 */
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('category')
      .order('category');
    
    if (error) throw error;
    
    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/business/:id
 * Get a single business by ID
 */
router.get('/:id', [
  param('id').notEmpty().withMessage('Business ID is required')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Business not found' });
      }
      throw error;
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/business
 * Create a new business
 */
router.post('/', [
  body('name').trim().isLength({ min: 1 }).withMessage('Business name is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('sub').optional().trim(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('distance').optional().trim(),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('location').optional().trim(),
  body('price').optional().trim(),
  body('verified').optional().isBoolean()
], validate, async (req, res) => {
  try {
    const businessData = {
      name: req.body.name,
      category: req.body.category,
      sub: req.body.sub || null,
      rating: req.body.rating || null,
      distance: req.body.distance || null,
      image: req.body.image || null,
      location: req.body.location || null,
      tag: req.body.tag || null,
      price: req.body.price || null,
      verified: req.body.verified || false,
      is_open: req.body.is_open ?? true,
      phone: req.body.phone || null,
      agent: req.body.agent || null
    };
    
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ 
      success: true, 
      message: 'Business created successfully',
      data 
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/business/:id
 * Update a business by ID
 */
router.put('/:id', [
  param('id').notEmpty().withMessage('Business ID is required'),
  body('name').optional().trim().isLength({ min: 1 }),
  body('category').optional().trim(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('image').optional().isURL()
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build update object with only provided fields
    const updateData = {};
    const allowedFields = ['name', 'category', 'sub', 'rating', 'distance', 'image', 
                           'location', 'tag', 'price', 'verified', 'is_open', 'phone', 'agent'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Business not found' });
      }
      throw error;
    }
    
    res.json({ 
      success: true, 
      message: 'Business updated successfully',
      data 
    });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/business/:id
 * Delete a business by ID
 */
router.delete('/:id', [
  param('id').notEmpty().withMessage('Business ID is required')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if business exists
    const { data: existing, error: findError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existing) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }
    
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      message: 'Business deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/business/category/:category
 * Get businesses by category
 */
router.get('/category/:category', [
  param('category').trim().notEmpty().withMessage('Category is required')
], validate, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false })
      .limit(parseInt(limit));
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
