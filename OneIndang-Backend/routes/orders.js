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

// ==================== ORDER OPERATIONS ====================

/**
 * GET /api/orders
 * Get all orders (optionally filter by user_id)
 */
router.get('/', [
  query('user_id').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt()
], validate, async (req, res) => {
  try {
    const { user_id, limit = 50, offset = 0 } = req.query;
    
    let queryBuilder = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          item_name,
          item_price,
          quantity,
          item_image
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filter by user if provided
    if (user_id) {
      queryBuilder = queryBuilder.eq('user_id', user_id);
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
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Get a single order by ID with items
 */
router.get('/:id', [
  param('id').notEmpty().withMessage('Order ID is required')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          item_name,
          item_price,
          quantity,
          item_image
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      throw error;
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/orders
 * Create a new order with items
 */
router.post('/', [
  body('user_id').optional().isUUID(),
  body('restaurant_name').trim().notEmpty().withMessage('Restaurant name is required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount is required'),
  body('delivery_address').trim().notEmpty().withMessage('Delivery address is required'),
  body('payment_method').trim().notEmpty().withMessage('Payment method is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Item price is required'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Item quantity must be at least 1')
], validate, async (req, res) => {
  try {
    const { 
      user_id, 
      restaurant_name, 
      total_amount, 
      delivery_address, 
      payment_method,
      delivery_note,
      items 
    } = req.body;
    
    // Create the order first
    const orderData = {
      user_id: user_id || null,
      restaurant_name,
      total_amount: parseFloat(total_amount),
      delivery_address,
      payment_method,
      delivery_note: delivery_note || null,
      status: 'Preparing',
      order_date: new Date().toISOString()
    };
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      item_name: item.name,
      item_price: parseFloat(item.price),
      quantity: parseInt(item.qty),
      item_image: item.img || null
    }));
    
    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();
    
    if (itemsError) throw itemsError;
    
    // Return the complete order with items
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      data: {
        ...order,
        order_items: insertedItems
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status
 */
router.put('/:id/status', [
  param('id').notEmpty().withMessage('Order ID is required'),
  body('status').trim().isIn(['Preparing', 'On the way', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status value')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      throw error;
    }
    
    res.json({ 
      success: true, 
      message: `Order status updated to ${status}`,
      data 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/orders/user/:userId
 * Get all orders for a specific user
 */
router.get('/user/:userId', [
  param('userId').isUUID().withMessage('Valid user ID is required')
], validate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          item_name,
          item_price,
          quantity,
          item_image
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/orders/:id
 * Cancel/delete an order (only if status is 'Preparing')
 */
router.delete('/:id', [
  param('id').notEmpty().withMessage('Order ID is required')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check order exists and status allows deletion
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .single();
    
    if (findError || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (order.status !== 'Preparing') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot cancel order that is already being delivered or completed' 
      });
    }
    
    // Delete order items first (foreign key constraint)
    await supabase.from('order_items').delete().eq('order_id', id);
    
    // Delete the order
    const { error } = await supabase.from('orders').delete().eq('id', id);
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
