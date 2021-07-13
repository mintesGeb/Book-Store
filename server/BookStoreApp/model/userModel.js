class User {
  constructor(username, password, role = "member") {
    this.username = username;
    this.password = password;
    this.role = role;
  }
  login() {
    return users.find(
      (user) => user.username == this.username && user.password == this.password
    );
  }
}

let users = [
  new User("mintes", "mintes123", "admin"),
  new User("jossy", "jossy123", "member"),
];

module.exports = User;
