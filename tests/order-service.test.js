const test = require("node:test");
const assert = require("node:assert/strict");
const Address = require("../src/domain/Address");
const Customer = require("../src/domain/Customer");
const Order = require("../src/domain/Order");
const OrderItem = require("../src/domain/OrderItem");
const ProductRepository = require("../src/repositories/ProductRepository");
const OrderRepository = require("../src/repositories/OrderRepository");
const OrderService = require("../src/services/OrderService");
const OrderValidator = require("../src/services/OrderValidator");
const DiscountCalculator = require("../src/services/DiscountCalculator");
const FreightCalculator = require("../src/services/FreightCalculator");
const PaymentProcessor = require("../src/services/PaymentProcessor");
const OrderSummaryFactory = require("../src/services/OrderSummaryFactory");

function setup({ type = "vip", coupon = "TECH10", payment = "credit_card", installments = 3, region = "sudeste" } = {}) {
  const products = new ProductRepository();
  const orders = new OrderRepository();
  const customer = new Customer("c1", "Ana Souza", "ana@example.com", "11999999999", type,
    new Address("Rua A", "1", "Presidente Prudente", "SP", "19000-000", region));
  const order = new Order("o1", customer, [
    new OrderItem(products.findById("p1"), 1),
    new OrderItem(products.findById("p2"), 2)
  ], coupon, payment, installments);
  const messages = [];
  const logs = [];
  const service = new OrderService({
    productRepository: products,
    orderRepository: orders,
    validator: new OrderValidator(products),
    discountCalculator: new DiscountCalculator(),
    freightCalculator: new FreightCalculator(),
    paymentProcessor: new PaymentProcessor(),
    notificationService: { sendOrderConfirmation: (...args) => messages.push(args) },
    logger: { info: (x) => logs.push(x), warn: (x) => logs.push(x), error: (x) => logs.push(x) },
    summaryFactory: new OrderSummaryFactory(),
    presenter: { present: () => {} }
  });
  return { products, orders, customer, order, service, messages, logs };
}

test("preserva o resultado esperado do pedido de exemplo", () => {
  const ctx = setup();
  const result = ctx.service.process(ctx.order);
  assert.equal(result.subtotal, 6440);
  assert.equal(result.discount, 1159.2);
  assert.equal(result.freight, 30);
  assert.equal(result.paymentFee, 161);
  assert.equal(result.total, 5471.8);
  assert.equal(result.status, "confirmed");
  assert.equal(ctx.products.findById("p1").stock, 7);
  assert.equal(ctx.products.findById("p2").stock, 28);
  assert.equal(ctx.orders.findAll().length, 1);
  assert.equal(ctx.messages.length, 1);
});

test("boleto aguarda pagamento e não envia confirmação", () => {
  const ctx = setup({ payment: "boleto", coupon: "FRETEGRATIS" });
  const result = ctx.service.process(ctx.order);
  assert.equal(result.status, "waiting_payment");
  assert.equal(result.freight, 0);
  assert.equal(ctx.messages.length, 0);
  assert.equal(ctx.logs.some((message) => message.includes("aguardando pagamento")), true);
});

test("PIX aplica desconto adicional de 3% e confirma", () => {
  const ctx = setup({ payment: "pix", installments: 1 });
  const result = ctx.service.process(ctx.order);
  assert.equal(result.discount, 1352.4);
  assert.equal(result.paymentFee, 0);
  assert.equal(result.status, "confirmed");
  assert.equal(ctx.messages.length, 1);
});

test("rejeita e-mail inválido sem alterar estoque", () => {
  const ctx = setup();
  ctx.customer.email = "email-invalido";
  assert.throws(() => ctx.service.process(ctx.order), /E-mail do cliente invalido/);
  assert.equal(ctx.products.findById("p1").stock, 8);
  assert.equal(ctx.orders.findAll().length, 0);
});

test("rejeita estoque insuficiente sem registrar pedido", () => {
  const ctx = setup();
  ctx.order.items[0].quantity = 99;
  assert.throws(() => ctx.service.process(ctx.order), /Estoque insuficiente/);
  assert.equal(ctx.orders.findAll().length, 0);
});

test("rejeita forma de pagamento desconhecida", () => {
  const ctx = setup({ payment: "cripto" });
  assert.throws(() => ctx.service.process(ctx.order), /Forma de pagamento invalida/);
  assert.equal(ctx.orders.findAll().length, 0);
});
