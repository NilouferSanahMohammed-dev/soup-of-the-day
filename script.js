/**
 * soup-of-the-day
 * ---------------
 * Picks a recipe based on the selected mood and renders it as a card
 * with a simple hand-drawn style bowl illustration, colored to match
 * the soup. Ingredients are checkable, just for the satisfaction of
 * ticking things off while you cook.
 */

const recipeStage = document.getElementById("recipeStage");
const moodPicker = document.getElementById("moodPicker");
const surpriseBtn = document.getElementById("surpriseBtn");

function bowlDoodle(color) {
  return `
    <svg viewBox="0 0 160 120" class="bowl-doodle" aria-hidden="true">
      <path d="M20 55 Q80 100 140 55 L132 70 Q80 108 28 70 Z" fill="${color}" opacity="0.9" />
      <ellipse cx="80" cy="55" rx="60" ry="16" fill="${color}" />
      <path d="M60 30 Q65 15 58 5" stroke="#cbb89d" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
      <path d="M80 28 Q85 12 78 2" stroke="#cbb89d" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5" />
      <path d="M100 30 Q105 15 98 5" stroke="#cbb89d" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
    </svg>
  `;
}

function pickRecipe(mood) {
  const pool = mood ? RECIPES.filter((r) => r.moods.includes(mood)) : RECIPES;
  const list = pool.length ? pool : RECIPES;
  return list[Math.floor(Math.random() * list.length)];
}

function renderRecipe(recipe) {
  recipeStage.innerHTML = `
    <article class="recipe-card">
      ${bowlDoodle(recipe.color)}
      <h2 class="recipe-name">${recipe.name}</h2>
      <p class="recipe-meta">${recipe.time} &middot; serves ${recipe.servings}</p>

      <div class="recipe-columns">
        <div class="recipe-ingredients">
          <h3>ingredients</h3>
          <ul id="ingredientList"></ul>
        </div>
        <div class="recipe-steps">
          <h3>steps</h3>
          <ol>
            ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      </div>
    </article>
  `;

  const list = document.getElementById("ingredientList");
  recipe.ingredients.forEach((ing, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox" data-i="${i}" /> ${ing}</label>`;
    list.appendChild(li);
  });

  recipeStage.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener("change", (e) => {
      e.target.closest("li").classList.toggle("checked", e.target.checked);
    });
  });
}

moodPicker.addEventListener("click", (e) => {
  const card = e.target.closest(".mood-card");
  if (!card) return;
  renderRecipe(pickRecipe(card.dataset.mood));
  recipeStage.scrollIntoView({ behavior: "smooth", block: "start" });
});

surpriseBtn.addEventListener("click", () => {
  renderRecipe(pickRecipe(null));
  recipeStage.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderRecipe(pickRecipe(null));
