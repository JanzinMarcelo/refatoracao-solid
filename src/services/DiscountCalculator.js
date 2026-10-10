class DiscountCalculator {
  calculate(order, subtotal) {
    let discount = 0;
    if (order.customer.type === "vip") discount += subtotal * 0.08;
    if (order.customer.type === "employee") discount += subtotal * 0.15;
    if (order.couponCode === "TECH10") discount += subtotal * 0.1;
    // FRETEGRATIS is a freight coupon; it does not add a product discount.
    if (subtotal > 8000) discount += 250;
    if (order.paymentMethod === "pix") discount += subtotal * 0.03;
    return discount;
  }
}
module.exports = DiscountCalculator;
