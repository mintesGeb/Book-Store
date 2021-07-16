class User {
  constructor(id, fullname, username, password, role = "member") {
    this.id = id;
    this.fullname = fullname;
    this.username = username;
    this.password = password;
    this.role = role;
    this.cart = [];
    this.Order = [];
  }
  signUp() {
    this.id = count;
    this.role = "member";
    const checkUsername = users.findIndex(
      (user) => user.username == this.username
    );
    if (checkUsername > -1) {
      throw Error("Username Already Exist");
    } else {
      users.push(this);
      count++;
      return this;
    }
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

  static showUser(uName) {
    return users.find((user) => user.username == uName);
  }
  static placeOrder(uName) {
    const index = users.findIndex((user) => user.username == uName);
    if (users[index].cart.length == 0) {
      throw new Error("You can't place an order. Your cart is empty");
      // return "please dont";
    }
    users[index].Order.push(users[index].cart);
    users[index].cart = [];
  }
  static showUserById(id) {
    return users.find((user) => user.id == id);
  }
}

let users = [
  new User("1", "mintes Gebre", "mintes", "mintes123", "admin"),
  new User("2", "jossy tekle", "jossy", "jossy123", "member"),
];
let count = 3;
module.exports = User;
