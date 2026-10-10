class OrderService {
  constructor({
    productRepository,
    orderRepository,
    validator,
    discountCalculator,
    freightCalculator,
    paymentProcessor,
    notificationService,
    logger,
    summaryFactory,
    presenter
  }) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.validator = validator;
    this.discountCalculator = discountCalculator;
    this.freightCalculator = freightCalculator;
    this.paymentProcessor = paymentProcessor;
    this.notificationService = notificationService;
    this.logger = logger;
    this.summaryFactory = summaryFactory;
    this.presenter = presenter;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);
    this.validator.validate(order);

    const subtotal = order.getSubtotal();
    const discount = this.discountCalculator.calculate(order, subtotal);
    const freight = this.freightCalculator.calculate(order);
    const payment = this.paymentProcessor.process(order, subtotal);
    const total = Number((subtotal - discount + freight + payment.fee).toFixed(2));

    if (total <= 0) throw new Error("Total do pedido invalido.");

    for (const item of order.items) {
      this.productRepository.updateStock(item.product.id, item.quantity);
    }

    order.status = payment.status === "approved" ? "confirmed" : "waiting_payment";
    const summary = this.summaryFactory.create(order, {
      subtotal,
      discount,
      freight,
      paymentFee: payment.fee,
      total
    });

    this.orderRepository.save(summary);

    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, total);
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }

    this.presenter.present(order, summary, this.logger);
    return summary;
  }
}
module.exports = OrderService;
