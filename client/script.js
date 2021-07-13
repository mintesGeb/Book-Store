// selectors
const home = document.getElementById("home");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

const title = document.getElementById("title");
const author = document.getElementById("author");
const isbn = document.getElementById("isbn");
const price = document.getElementById("price");
const description = document.getElementById("description");
const bookSubmitBtn = document.getElementById("book-submit-btn");
const formElements = [title, author, isbn, price, description];

const allBooksDisplay = document.getElementById("books-display");

const bookIcon = document.querySelector(".book-icon");

const searchByIdInput = document.getElementById("search-by-id");
const searchBtn = document.getElementById("search-btn");

const infoForm = document.getElementById("info-form");
const addBookBtn = document.getElementById("book-add-btn");
const deleteBookBtn = document.getElementById("book-delete-btn");
const updateBookBtn = document.getElementById("book-update-btn");

const displayArea = document.getElementById("display-area");

const selectedBooks = [];

const deleteUpdateId = document.getElementById("delete-update-id");

const delUpAddDiv = document.getElementById("up-del-btn-div");
const addToCartBtn = document.querySelector(".add-to-cart");
const cartImg = document.getElementById("cart-img");
const cartItems = document.getElementById("cart-items");

let activeForm;

function displayHomePage() {
  document.getElementById("shopping").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
  document.getElementById("loginErrorMsg").textContent = "";
  document.getElementById("search").style.display = "block";
  infoForm.style.display = "none";
  document.getElementById("enter-id-msg").style.display = "none";
  document.getElementById("cart-display").style.display = "none";
  cartImg.style.display = "block";
}

function displayLoginPage() {
  document.getElementById("shopping").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("search").style.display = "none";
  document.getElementById("enter-id-msg").style.display = "none";
  document.getElementById("cart-display").style.display = "none";
  cartImg.style.display = "none";
}

function showForm() {
  infoForm.style.display = "block";
}

window.onload = function () {
  checkCart();
  document.getElementById("cart-display").style.display = "none";
  if (sessionStorage.getItem("accessToken")) {
    displayHomePage();
    getAllBooks();

    document.getElementById(
      "greeting"
    ).innerHTML = `Hi ${sessionStorage.getItem("username")}`;

    if (sessionStorage.getItem("role") == "member") {
      delUpAddDiv.style.display = "none";
    } else {
      delUpAddDiv.style.display = "block";
    }
  } else {
    displayLoginPage();
  }

  loginBtn.onclick = login;
  logoutBtn.onclick = logout;
  bookSubmitBtn.onclick = () => {
    if (activeForm == "add") {
      submitBook();
    } else if (activeForm == "update") {
      updateBook();
    }
  };
  window.onclick = (e) => {
    document.getElementById("cart-display").style.display = "none";
    allBooksDisplay.style.opacity = "100%";
    if (e.target.getAttribute("class") == "book-icon") {
      selectBook(e);
    } else if (e.target.getAttribute("class").split(" ")[0] == "add-to-cart") {
      addToCart(e);
    }
  };

  addBookBtn.onclick = () => {
    activeForm = "add";
    showForm();
    document.getElementById("product-heading").innerHTML = "Add a new Book";
  };
  searchBtn.onclick = searchById;
  home.onclick = () => {
    location.reload();
  };
  deleteBookBtn.onclick = () => {
    if (deleteUpdateId.value) {
      document.getElementById("enter-id-msg").style.display = "none";
      deleteBookByID(deleteUpdateId.value);
      deleteUpdateId.value = "";
    } else {
      document.getElementById("enter-id-msg").style.display = "block";
    }
  };
  updateBookBtn.onclick = () => {
    if (deleteUpdateId.value) {
      document.getElementById("enter-id-msg").style.display = "none";
      updateSetup();
    } else {
      document.getElementById("enter-id-msg").style.display = "block";
    }
  };
  cartImg.onclick = showMyCartItems;
};

async function login() {
  event.preventDefault();
  let response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  const data = await response.json();

  if (data.token) {
    sessionStorage.setItem("accessToken", data.token);
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("username", data.username);
    displayHomePage();
    getAllBooks();
  } else {
    document.getElementById("loginErrorMsg").textContent =
      "Wrong Username or Password";
  }
}

function logout() {
  sessionStorage.removeItem("accessToken");
  location.reload();
}

async function submitBook() {
  let bookToPost = {
    title: title.value,
    author: author.value,
    isbn: isbn.value,
    price: price.value,
    description: description.value,
  };

  const response = await fetch("http://localhost:5000/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    },
    body: JSON.stringify(bookToPost),
  });
  const data = await response.json();

  displayBooks(data.result);
  infoForm.style.display = "none";
  formElements.forEach((element) => {
    element.value = "";
  });
}
function displayBooks(bookObj) {
  let divOfBook = document.createElement("div");
  divOfBook.id = `${bookObj._id}-div`;
  let hr = document.createElement("hr");
  hr.style.width = "60%";

  let btn = document.createElement("button");
  btn.innerHTML = "Add To Cart";
  btn.setAttribute("class", "add-to-cart btn btn-primary ");
  btn.id = `${bookObj._id}-cart`;

  let iconDisplay = document.createElement("img");
  iconDisplay.src = "https://image.flaticon.com/icons/png/512/166/166088.png";
  iconDisplay.style.width = "50px";
  iconDisplay.style.border = "1px solid black";
  iconDisplay.style.padding = "5px";
  iconDisplay.id = `${bookObj._id}-icon`;
  iconDisplay.setAttribute("class", `book-icon`);

  let textDisplay = document.createElement("p");
  textDisplay.innerHTML = `<p><b>ID:</b> ${bookObj._id}</p><p><b>Title:</b> ${bookObj.title}</p>\n<p><b>Author:</b> ${bookObj.author}</p>\n<p><b>Description:</b> ${bookObj.description}</p><p><b>Price:</b> ${bookObj.price}</p>`;

  // divOfBook.appendChild(hr);
  divOfBook.appendChild(iconDisplay);
  divOfBook.appendChild(textDisplay);
  divOfBook.appendChild(btn);
  divOfBook.appendChild(hr);

  allBooksDisplay.appendChild(divOfBook);
}

async function getAllBooks() {
  const response = await fetch("http://localhost:5000/books", {
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + sessionStorage.getItem("accessToken"),
    },
  });
  const data = await response.json();
  allBooksDisplay.innerHTML = "";
  data.result.forEach((book) => {
    displayBooks(book);
  });
}

function checkExistance(id) {
  let status = "doesn't exist";
  if (selectedBooks.length === 0) return status;

  selectedBooks.forEach((item) => {
    item.then((book) => {
      console.log(id, book._id);
      if (Number(id) == book._id) {
        status = "exists";
      }
    });
  });
  return status;
}
function selectBook(e) {
  if (e.target.getAttribute("class") == "book-icon") {
    let id = e.target.getAttribute("id").split("-")[0];
    document
      .getElementById(e.target.parentNode.id)
      .classList.toggle("turquoise");
    console.log(id);

    console.log(checkExistance(id)); //problematic

    selectedBooks.push(getBookById(id));
  }
}
function addToCart(e) {
  console.log();
  if (e.target.getAttribute("class").split(" ")[0] == "add-to-cart") {
    let id = e.target.getAttribute("id").split("-")[0];
    console.log(
      "add to cart: " + id + " " + sessionStorage.getItem("username")
    );
    const reqObj = { username: sessionStorage.getItem("username"), bookId: id };
    addToCartRequest(reqObj);
  }
}
async function addToCartRequest(objBody) {
  const response = await fetch("http://localhost:5000/cart/addtocart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(objBody),
  });
  const data = await response.json();
  console.log(data.cart);
}

async function getBookById(bookID) {
  try {
    const response = await fetch(`http://localhost:5000/books/${bookID}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + sessionStorage.getItem("accessToken"),
      },
    });
    const data = await response.json();
    console.log(data.result);
    return data.result;
  } catch (err) {
    console.log(err);
  }
}

function searchById() {
  const searchResult = getBookById(searchByIdInput.value);
  searchByIdInput.value = "";
  if (searchResult) {
    allBooksDisplay.innerHTML = "";
    searchResult.then((data) => {
      displayBooks(data);
    });
  }
}
async function deleteBookByID(bookID) {
  //   console.log("inside delete");
  const response = await fetch(`http://localhost:5000/books/${bookID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    },
  });
  const data = await response.json();
  console.log(data.result);
  allBooksDisplay.innerHTML = "";
  data.result.forEach((book) => {
    displayBooks(book);
  });
}

function updateSetup() {
  activeForm = "update";
  showForm();
  document.getElementById("product-heading").innerHTML = "Update Book";
  let beforeUpdate = getBookById(deleteUpdateId.value);
  beforeUpdate.then((book) => {
    title.value = book.title;
    author.value = book.author;
    isbn.value = book.isbn;
    price.value = book.price;
    description.value = book.description;
  });
  //   console.log(beforeUpdate.title);
}

async function updateBook() {
  let bookID = deleteUpdateId.value;

  let bookToUpdate = {
    title: title.value,
    author: author.value,
    isbn: isbn.value,
    price: price.value,
    description: description.value,
  };
  const response = await fetch(`http://localhost:5000/books/${bookID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + sessionStorage.getItem("accessToken"),
    },
    body: JSON.stringify(bookToUpdate),
  });
  const data = await response.json();
  getAllBooks();

  deleteUpdateId.value = "";
  infoForm.style.display = "none";
  formElements.forEach((element) => {
    element.value = "";
  });
}

async function showMyCartItems() {
  document.getElementById("cart-display").innerHTML = "";
  let user = sessionStorage.getItem("username");
  const response = await fetch(`http://localhost:5000/cart/${user}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + sessionStorage.getItem("accessToken"),
    },
  });
  const data = await response.json();
  console.log(data.cart);
  allBooksDisplay.style.opacity = "30%";
  document.getElementById("cart-display").style.display = "block";

  data.cart.forEach((bookId) => {
    getBookById(bookId).then((forDisplay) => {
      displayBooksOnCart(forDisplay);
    });
  });
}

async function checkCart() {
  let user = sessionStorage.getItem("username");
  const response = await fetch(`http://localhost:5000/cart/${user}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + sessionStorage.getItem("accessToken"),
    },
  });
  const data = await response.json();
  console.log(data.cart);
  if (data.cart.length > 0) {
    cartItems.style.display = "block";
    cartItems.innerHTML = data.cart.length;
  } else {
    cartItems.style.display = "none";
  }
}

function displayBooksOnCart(bookObj) {
  let textDisplay = document.createElement("p");
  textDisplay.innerHTML = `-<b> ${bookObj.title}</b>, by ${bookObj.author} - $${bookObj.price}`;

  document.getElementById("cart-display").appendChild(textDisplay);
}
