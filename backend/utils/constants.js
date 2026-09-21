module.exports = {
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },
  ORDER_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    CONFIRMED: 'confirmed',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    FAILED: 'failed',
  },
  DEFAULT_SHIPPING_FEE: 150,
  FREE_SHIPPING_THRESHOLD: 5000,
  LOW_STOCK_THRESHOLD: 5,
};
