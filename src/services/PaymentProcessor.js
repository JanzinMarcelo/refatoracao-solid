class PaymentProcessor {
  process(order, subtotal) {
    if (order.paymentMethod === "pix") {
      return { status: "approved", fee: 0 };
    }
    if (order.paymentMethod === "credit_card") {
      return { status: "approved", fee: order.installments > 1 ? subtotal * 0.025 : 0 };
    }
    if (order.paymentMethod === "boleto") {
      return { status: "waiting_payment", fee: 0 };
    }
    throw new Error("Forma de pagamento invalida.");
  }
}
module.exports = PaymentProcessor;
