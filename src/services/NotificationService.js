class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log("Confirmação do pedido enviada.");
    console.log(`Cliente: ${customer.name}`);
    console.log(`E-mail: ${customer.email}`);
    console.log(`Pedido: ${orderId}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);
  }
}
module.exports = NotificationService;
