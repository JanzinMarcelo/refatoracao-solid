class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }

  getAddressDetails() {
    return {
      city: this.address.city,
      state: this.address.state,
      region: this.address.region
    };
  }
}
module.exports = Customer;
