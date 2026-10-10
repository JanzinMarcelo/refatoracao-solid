class OrderSummaryFactory {
  create(order, values) {
    const address = order.customer.getAddressDetails();
    return {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: address.city,
      state: address.state,
      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal: values.subtotal,
      discount: Number(values.discount.toFixed(2)),
      freight: Number(values.freight.toFixed(2)),
      paymentFee: Number(values.paymentFee.toFixed(2)),
      total: values.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };
  }
}
module.exports = OrderSummaryFactory;
