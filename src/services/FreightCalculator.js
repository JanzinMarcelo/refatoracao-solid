class FreightCalculator {
  calculate(order) {
    const { region } = order.customer.getAddressDetails();
    const totalWeight = order.getTotalWeight();
    let freight;

    if (region === "sudeste") freight = 20 + totalWeight * 4;
    else if (region === "sul") freight = 28 + totalWeight * 5;
    else if (region === "centro-oeste") freight = 35 + totalWeight * 6;
    else if (region === "nordeste") freight = 45 + totalWeight * 7;
    else if (region === "norte") freight = 60 + totalWeight * 9;
    else freight = 50 + totalWeight * 8;

    return order.couponCode === "FRETEGRATIS" ? 0 : freight;
  }
}
module.exports = FreightCalculator;
