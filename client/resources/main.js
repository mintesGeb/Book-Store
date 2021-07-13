function displayHomePage() {
    document.getElementById('shopping').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('loginErrorMsg').textContent = '';
    getProducts();
}

function displayLoginPage() {
    document.getElementById('shopping').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

window.onload = function() {
    if (sessionStorage.getItem('accessToken')) {
        displayHomePage();
    } else {
        displayLoginPage();
    }

    document.getElementById('loginBtn').onclick = async function(event) {
        event.preventDefault();
        let result = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        }).then(response => response.json());

        if (result.accessToken) {
            sessionStorage.setItem('accessToken', result.accessToken);
            displayHomePage();
        } else {
            document.getElementById('loginErrorMsg').textContent = result.error;
        }
    }

    document.getElementById('logoutBtn').onclick = function(event) {
        sessionStorage.removeItem('accessToken');
        location.reload();
    }

    // add/update product
    document.getElementById('product-btn').onclick = function(event) {
        event.preventDefault();
        if (!document.getElementById('product-btn').dataset.id) {
            addProduct();
        } else {
            editProduct();
        }
    }
}

async function getProducts() {
    let products = await fetch('http://localhost:3000/products/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        }
    }).then(response => response.json());
    products.forEach(prod => renderProduct(prod));
}

function renderProduct(prod) {
    const div = document.createElement('div');
    div.classList = 'col-lg-4';
    div.id = prod._id;
    div.innerHTML = `<svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false">
    <title>Placeholder</title>
    <rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777"
        dy=".3em">140x140</text>
    </svg>`;

    const h2 = document.createElement('h2');
    h2.textContent = prod.title;

    const price = document.createElement('p');
    price.textContent = prod.price;

    const description = document.createElement('p');
    description.textContent = prod.description;

    div.appendChild(h2);
    div.appendChild(price);
    div.appendChild(description);

    const actions = document.createElement('p');
    const updateBtn = document.createElement('a');
    updateBtn.classList = 'btn btn-secondary';
    updateBtn.textContent = 'UPDATE';
    updateBtn.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('product-heading').textContent = 'Edit Product';
        document.getElementById('title').value = prod.title;
        document.getElementById('price').value = prod.price;
        document.getElementById('description').value = prod.description;
        document.getElementById('product-btn').dataset.id = prod._id;
    });

    const deleteBtn = document.createElement('a');
    deleteBtn.classList = 'btn btn-secondary';
    deleteBtn.textContent = 'DELETE';
    deleteBtn.addEventListener('click', function(event) {
        event.preventDefault();

        fetch('http://localhost:3000/products/' + prod._id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            }
        }).then(response => {
            alert('Delete Successfully!');
            div.remove();
        });
    });

    actions.appendChild(updateBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(actions);

    document.getElementById('products').appendChild(div);
}


async function addProduct() {
    let result = await fetch('http://localhost:3000/products/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value
        })
    }).then(res => res.json());
    document.getElementById('product-form').reset();
    renderProduct(result);
}

function editProduct() {
    const prodId = document.getElementById('product-btn').dataset.id;
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    fetch('http://localhost:3000/products/' + prodId, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                title: title,
                price: price,
                description: description
            })
        }).then(response => response.json())
        .then(jsonObj => {
            const productDiv = document.getElementById(prodId);
            productDiv.querySelector('h2').textContent = title;
            const paragraphArr = productDiv.querySelectorAll('p');
            paragraphArr[0].textContent = price;
            paragraphArr[1].textContent = description;

            document.getElementById('product-heading').textContent = 'Add a new Product';
            document.getElementById('product-btn').dataset.id = '';
            document.getElementById('product-form').reset();
        });
}