const Address = require("./domain/Address");
const Customer = require("./domain/Customer");
const Order = require("./domain/Order");
const OrderItem = require("./domain/OrderItem");

const OrderService = require("./services/OrderService");

const ProductRepository = require("./repositories/ProductRepository");
const OrderRepository = require("./repositories/OrderRepository");

const OrderValidator = require("./services/OrderValidator");
const DiscountCalculator = require("./services/DiscountCalculator");
const FreightCalculator = require("./services/FreightCalculator");
const PaymentProcessor = require("./services/PaymentProcessor");
const NotificationService = require("./services/NotificationService");
const OrderSummaryFactory = require("./services/OrderSummaryFactory");
const OrderPresenter = require("./services/OrderPresenter");
const Logger = require("./utils/Logger");


const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const validator = new OrderValidator(productRepository);
const discountCalculator = new DiscountCalculator();
const freightCalculator = new FreightCalculator();
const paymentProcessor = new PaymentProcessor();
const notificationService = new NotificationService();
const logger = new Logger();
const summaryFactory = new OrderSummaryFactory();
const presenter = new OrderPresenter();


const service = new OrderService({
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
});


const customer = new Customer(
  "c1",
  "Ana Souza",
  "ana.souza@example.com",
  "18999990000",
  "vip",
  new Address(
    "Rua das Palmeiras",
    "120",
    "Presidente Prudente",
    "SP",
    "19000-000",
    "sudeste"
  )
);

const notebook = productRepository.findById("p1");
const mouse = productRepository.findById("p2");

const order = new Order(
  "o1001",
  customer,
  [
    new OrderItem(notebook, 1),
    new OrderItem(mouse, 2)
  ],
  "TECH10",
  "credit_card",
  3
);


const result = service.process(order);

console.log(JSON.stringify(result, null, 2));