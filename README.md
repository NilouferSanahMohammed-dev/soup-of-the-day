# the cookbook 🍲

What started as a mood-based soup picker grew into an actual personal cookbook. Two dozen real recipes from around the world to start, your own categories, your own additions, and a layout you can recolor to match your kitchen. This repo is still called `soup-of-the-day` since that's where the link already lives, but the app itself outgrew soup a while ago.

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## What's here

Twenty-two recipes to start, spanning Italy, Thailand, India, Mexico, Morocco, Vietnam, Korea, Lebanon, Turkey, Spain, Peru, Ethiopia, Jamaica, China, Japan, and a few internet-famous ones (baked feta pasta, dalgona coffee, birria tacos) alongside the classics. Search across all of them, filter by category, or just scroll.

Every recipe has real ingredients with measurements, steps you can actually follow, and checkboxes so you can tick things off as you cook.

## How it works, in plain English

- On your very first visit, the built-in recipes and categories get copied once into `localStorage`
- From that point on, everything you see, including the original built-ins, lives in your own saved copy and can be freely edited or deleted, this isn't a fixed catalog with your additions bolted on the side, it's genuinely all yours to reshape
- Searching filters by name, cuisine, category, and ingredients all at once
- Adding a category just adds a name to a saved list, and it shows up as a filter chip immediately
- Customizing the theme (accent color, background, grid or list layout) writes straight to CSS variables, so the whole page updates live as you adjust it

## Making it yours

- **Add a recipe**: the "+ add a recipe" button opens a form for name, cuisine, category, time, servings, an accent color, and ingredients and steps (one per line each)
- **Add a category**: type a name into the "+ new category" field under the filter chips, hit enter, done
- **Edit or delete anything**: open any recipe and use the edit or delete buttons, this works on the built-in recipes too, not just ones you've added
- **Customize the look**: the "customize" button in the header lets you pick an accent color, a background color, and switch between a grid or list layout

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Where your data lives

Everything (your recipes, your categories, your theme) is saved to `localStorage`, so it's private to whatever browser you're using and won't follow you to a different device. If you want to back it up, your browser's dev tools will show the `cookbook-recipes-v1`, `cookbook-categories-v1`, and `cookbook-theme-v1` keys under localStorage.

## Adding recipes in bulk

If you'd rather seed a bunch of recipes at once instead of using the form, `recipes.js` has the full `BUILT_IN_RECIPES` array in the exact shape the app expects, copy that structure for your own list. Just know that file only seeds the *very first* visit, once `localStorage` has data, `recipes.js` is no longer read.

## License

MIT. Cook whatever you want, from wherever you want.
