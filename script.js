/**
 * the cookbook
 * ------------
 * On first visit ever, the built-in recipes and categories from
 * recipes.js get copied once into localStorage. From that point on,
 * everything (including the original built-ins) lives in localStorage
 * and can be freely edited, deleted, or added to, this is meant to
 * feel like your own cookbook, not a fixed catalog with your own
 * additions bolted on the side.
 */

const RECIPES_KEY = "cookbook-recipes-v1";
const CATEGORIES_KEY = "cookbook-categories-v1";
const THEME_KEY = "cookbook-theme-v1";

const DEFAULT_THEME = { accent: "#d9a441", bg: "#eef0e3", layout: "grid" };

/* ---------------- Storage ---------------- */

function loadRecipes() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECIPES_KEY));
    if (saved) return saved;
  } catch {}
  localStorage.setItem(RECIPES_KEY, JSON.stringify(BUILT_IN_RECIPES));
  return [...BUILT_IN_RECIPES];
}
function saveRecipes(recipes) {
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

function loadCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
    if (saved) return saved;
  } catch {}
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(BUILT_IN_CATEGORIES));
  return [...BUILT_IN_CATEGORIES];
}
function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY));
    if (saved) return { ...DEFAULT_THEME, ...saved };
  } catch {}
  return { ...DEFAULT_THEME };
}
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}

let recipes = loadRecipes();
let categories = loadCategories();
let theme = loadTheme();
let activeCategory = "all";
let searchTerm = "";
let editingRecipeId = null;

/* ---------------- DOM refs ---------------- */

const recipeGrid = document.getElementById("recipeGrid");
const categoryRow = document.getElementById("categoryRow");
const searchInput = document.getElementById("searchInput");
const newCategoryForm = document.getElementById("newCategoryForm");
const newCategoryInput = document.getElementById("newCategoryInput");

const detailOverlay = document.getElementById("detailOverlay");
const detailCard = document.getElementById("detailCard");

const formOverlay = document.getElementById("formOverlay");
const recipeForm = document.getElementById("recipeForm");
const formTitle = document.querySelector(".form-title");
const addRecipeBtn = document.getElementById("addRecipeBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const fName = document.getElementById("fName");
const fCuisine = document.getElementById("fCuisine");
const fCategory = document.getElementById("fCategory");
const fTime = document.getElementById("fTime");
const fServings = document.getElementById("fServings");
const fColor = document.getElementById("fColor");
const fIngredients = document.getElementById("fIngredients");
const fSteps = document.getElementById("fSteps");

const customizeBtn = document.getElementById("customizeBtn");
const customizeOverlay = document.getElementById("customizeOverlay");
const themeAccent = document.getElementById("themeAccent");
const themeBg = document.getElementById("themeBg");
const themeLayout = document.getElementById("themeLayout");
const resetThemeBtn = document.getElementById("resetThemeBtn");
const closeCustomizeBtn = document.getElementById("closeCustomizeBtn");

/* ---------------- Theme ---------------- */

function applyTheme() {
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--bg", theme.bg);
  recipeGrid.classList.toggle("layout-list", theme.layout === "list");
  themeAccent.value = theme.accent;
  themeBg.value = theme.bg;
  themeLayout.value = theme.layout;
}

customizeBtn.addEventListener("click", () => customizeOverlay.classList.add("open"));
closeCustomizeBtn.addEventListener("click", () => customizeOverlay.classList.remove("open"));
customizeOverlay.addEventListener("click", (e) => {
  if (e.target === customizeOverlay) customizeOverlay.classList.remove("open");
});

[themeAccent, themeBg, themeLayout].forEach((el) => {
  el.addEventListener("input", () => {
    theme = { accent: themeAccent.value, bg: themeBg.value, layout: themeLayout.value };
    saveTheme(theme);
    applyTheme();
  });
});

resetThemeBtn.addEventListener("click", () => {
  theme = { ...DEFAULT_THEME };
  saveTheme(theme);
  applyTheme();
});

/* ---------------- Categories ---------------- */

function renderCategoryRow() {
  categoryRow.innerHTML = "";

  const allChip = document.createElement("button");
  allChip.className = `category-chip${activeCategory === "all" ? " active" : ""}`;
  allChip.textContent = "all";
  allChip.addEventListener("click", () => { activeCategory = "all"; renderAll(); });
  categoryRow.appendChild(allChip);

  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = `category-chip${activeCategory === cat ? " active" : ""}`;
    const isBuiltIn = BUILT_IN_CATEGORIES.includes(cat);
    chip.innerHTML = `<span>${cat}</span>${!isBuiltIn ? `<span class="chip-remove" data-cat="${cat}">&times;</span>` : ""}`;
    chip.addEventListener("click", (e) => {
      if (e.target.closest(".chip-remove")) return;
      activeCategory = cat;
      renderAll();
    });
    categoryRow.appendChild(chip);
  });

  categoryRow.querySelectorAll(".chip-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat;
      categories = categories.filter((c) => c !== cat);
      saveCategories(categories);
      if (activeCategory === cat) activeCategory = "all";
      renderAll();
    });
  });

  fCategory.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

newCategoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = newCategoryInput.value.trim().toLowerCase();
  if (!name || categories.includes(name)) return;
  categories.push(name);
  saveCategories(categories);
  newCategoryInput.value = "";
  activeCategory = name;
  renderAll();
});

/* ---------------- Recipe grid ---------------- */

function filteredRecipes() {
  return recipes.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const haystack = `${r.name} ${r.cuisine} ${r.category} ${(r.ingredients || []).join(" ")}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderGrid() {
  const list = filteredRecipes();
  recipeGrid.innerHTML = "";

  if (list.length === 0) {
    recipeGrid.innerHTML = `<p style="color:var(--ink-soft); font-size:13.5px;">nothing matches that yet. try a different search, or add it yourself.</p>`;
    return;
  }

  list.forEach((r) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.innerHTML = `
      ${r.custom ? `<span class="custom-flag">yours</span>` : ""}
      <div class="recipe-swatch" style="background:${r.color}"></div>
      <h3 class="recipe-name">${r.name}</h3>
      <div class="recipe-meta">
        <span class="badge">${r.cuisine || "uncategorized"}</span>
        <span class="badge">${r.category}</span>
        ${r.era === "trending" ? `<span class="badge trending">trending</span>` : ""}
      </div>
    `;
    card.addEventListener("click", () => openDetail(r.id));
    recipeGrid.appendChild(card);
  });
}

function renderAll() {
  renderCategoryRow();
  renderGrid();
}

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderGrid();
});

/* ---------------- Recipe detail ---------------- */

function openDetail(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return;

  detailCard.innerHTML = `
    <button class="detail-close" id="detailCloseBtn">&times;</button>
    <div class="detail-swatch" style="background:${r.color}"></div>
    <h2 class="detail-name">${r.name}</h2>
    <p class="detail-meta">${r.cuisine || ""} &middot; ${r.category} &middot; ${r.time} &middot; serves ${r.servings}${r.era === "trending" ? ` &middot; trending` : ""}</p>
    <div class="detail-columns">
      <div>
        <h3>ingredients</h3>
        <ul id="detailIngredients"></ul>
      </div>
      <div>
        <h3>steps</h3>
        <ol>${(r.steps || []).map((s) => `<li>${s}</li>`).join("")}</ol>
      </div>
    </div>
    <div class="detail-actions">
      <button class="ghost-btn" id="deleteRecipeBtn">delete</button>
      <button class="ghost-btn" id="editRecipeBtn">edit</button>
    </div>
  `;

  const ul = document.getElementById("detailIngredients");
  (r.ingredients || []).forEach((ing, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox" data-i="${i}" /> ${ing}</label>`;
    ul.appendChild(li);
  });
  ul.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener("change", (e) => e.target.closest("li").classList.toggle("checked", e.target.checked));
  });

  document.getElementById("detailCloseBtn").addEventListener("click", () => detailOverlay.classList.remove("open"));
  document.getElementById("deleteRecipeBtn").addEventListener("click", () => {
    recipes = recipes.filter((x) => x.id !== id);
    saveRecipes(recipes);
    detailOverlay.classList.remove("open");
    renderGrid();
  });
  document.getElementById("editRecipeBtn").addEventListener("click", () => {
    detailOverlay.classList.remove("open");
    openForm(r);
  });

  detailOverlay.classList.add("open");
}

detailOverlay.addEventListener("click", (e) => {
  if (e.target === detailOverlay) detailOverlay.classList.remove("open");
});

/* ---------------- Add / edit recipe form ---------------- */

function openForm(existing) {
  editingRecipeId = existing ? existing.id : null;
  formTitle.textContent = existing ? "edit recipe" : "add a recipe";
  fName.value = existing?.name || "";
  fCuisine.value = existing?.cuisine || "";
  fCategory.value = existing?.category || categories[0];
  fTime.value = existing?.time || "";
  fServings.value = existing?.servings || 4;
  fColor.value = existing?.color || "#c9772f";
  fIngredients.value = (existing?.ingredients || []).join("\n");
  fSteps.value = (existing?.steps || []).join("\n");
  formOverlay.classList.add("open");
}

addRecipeBtn.addEventListener("click", () => openForm(null));
cancelFormBtn.addEventListener("click", () => formOverlay.classList.remove("open"));
formOverlay.addEventListener("click", (e) => {
  if (e.target === formOverlay) formOverlay.classList.remove("open");
});

recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = fName.value.trim();
  if (!name) return;

  const recipeData = {
    id: editingRecipeId || `custom-${Date.now()}`,
    name,
    cuisine: fCuisine.value.trim(),
    category: fCategory.value,
    era: "classic",
    time: fTime.value.trim() || "—",
    servings: Number(fServings.value) || 1,
    color: fColor.value,
    ingredients: fIngredients.value.split("\n").map((s) => s.trim()).filter(Boolean),
    steps: fSteps.value.split("\n").map((s) => s.trim()).filter(Boolean),
    custom: true,
  };

  if (editingRecipeId) {
    recipes = recipes.map((r) => (r.id === editingRecipeId ? recipeData : r));
  } else {
    recipes.unshift(recipeData);
  }
  saveRecipes(recipes);
  formOverlay.classList.remove("open");
  renderGrid();
});

/* ---------------- Boot ---------------- */

applyTheme();
renderAll();
