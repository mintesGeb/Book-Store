class User {
  constructor(username, password, role = "member") {
    this.username = username;
    this.password = password;
    this.role = role;
    this.cart = [];
    this.Order = [];
  }
  login() {
    return users.find(
      (user) => user.username == this.username && user.password == this.password
    );
  }
  static addToCart(uName, book) {
    const index = users.findIndex((user) => user.username == uName);
    users[index].cart.push(book);
  }
  static removeFromCart(uName, book) {
    const index = users.findIndex((user) => user.username == uName);
    users[index].cart = users[index].cart.filter((item) => item !== book);
  }
  static order(uName) {}
  static showUser(uName) {
    return users.find((user) => user.username == uName);
  }
}

let users = [
  new User("mintes", "mintes123", "admin"),
  new User("jossy", "jossy123", "member"),
];

module.exports = User;
