const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

if (token) showApp();

function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (res.ok) { alert('Registered! Please login.'); toggleAuth(); }
    else alert('Error registering');
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        token = data.token;
        showApp();
    } else {
        alert(data.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    loadFavorites();
}

async function searchRecipes() {
    const ingredient = document.getElementById('ingredient-input').value;
    if (!ingredient) return;
    
    const res = await fetch(`${API_URL}/recipes/search/${ingredient}`);
    const data = await res.json();
    const container = document.getElementById('results-list');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    data.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h4>${meal.strMeal}</h4>
            <button class="fav-btn" onclick="addFavorite('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Save ❤</button>
            <button class="view-btn" onclick="getRecipeDetails('${meal.idMeal}')">View Recipe</button>
        `;
        container.appendChild(div);
    });
}

async function addFavorite(id, title, image) {
    await fetch(`${API_URL}/recipes/favorites`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, title, image })
    });
    loadFavorites();
}

async function loadFavorites() {
    const res = await fetch(`${API_URL}/recipes/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const container = document.getElementById('favorites-list');
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    data.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${meal.image}" alt="${meal.title}">
            <h4>${meal.title}</h4>
            <button class="view-btn" onclick="getRecipeDetails('${meal.id}')">View</button>
            <button class="delete-btn" onclick="removeFavorite('${meal.id}')">Remove ❌</button>
        `;
        container.appendChild(div);
    });
}

async function getRecipeDetails(id) {
    const res = await fetch(`${API_URL}/recipes/${id}`);
    const meal = await res.json();

    document.getElementById('modal-title').innerText = meal.strMeal;
    document.getElementById('modal-img').src = meal.strMealThumb;
    document.getElementById('modal-instructions').innerText = meal.strInstructions;

    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = '';
    
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.innerText = `${measure} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }

    document.getElementById('recipe-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('recipe-modal').classList.add('hidden');
}

window.onclick = function(event) {
    const modal = document.getElementById('recipe-modal');
    if (event.target == modal) {
        closeModal();
    }
}

async function removeFavorite(id) {
    const res = await fetch(`${API_URL}/recipes/favorites/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });

    if (res.ok) {
        loadFavorites(); 
    } else {
        alert("Failed to remove favorite");
    }
}


function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    loadFavorites();
    populateFilters(); 
}


let categories = [];
let areas = [];

async function populateFilters() {

    const catRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const catData = await catRes.json();
    categories = catData.meals;


    const areaRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const areaData = await areaRes.json();
    areas = areaData.meals;
}


function toggleSearchInput() {
    const type = document.getElementById('filter-type').value;
    const input = document.getElementById('search-input');
    const select = document.getElementById('filter-options');

    if (type === 'ingredient') {
        input.classList.remove('hidden');
        select.classList.add('hidden');
        input.placeholder = "Enter ingredient (e.g., egg)";
    } else {

        input.classList.add('hidden');
        select.classList.remove('hidden');
        

        select.innerHTML = '';
        const data = type === 'category' ? categories : areas;
        const key = type === 'category' ? 'strCategory' : 'strArea';
        
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[key];
            option.innerText = item[key];
            select.appendChild(option);
        });
    }
}


async function searchRecipes() {
    const type = document.getElementById('filter-type').value;
    let term = "";

    if (type === 'ingredient') {
        term = document.getElementById('search-input').value;
    } else {
        term = document.getElementById('filter-options').value;
    }

    if (!term) return;


    const res = await fetch(`${API_URL}/recipes/search?type=${type}&term=${term}`);
    const data = await res.json();
    const container = document.getElementById('results-list');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    data.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h4>${meal.strMeal}</h4>
            <button class="fav-btn" onclick="addFavorite('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Save ❤</button>
            <button class="view-btn" onclick="getRecipeDetails('${meal.idMeal}')">View Recipe</button>
        `;
        container.appendChild(div);
    });
}