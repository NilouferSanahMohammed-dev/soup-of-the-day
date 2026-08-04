# soup-of-the-day 🍲

A cozy little app that picks a soup recipe based on how you're feeling. Pick a mood, get a real recipe with an illustrated bowl to match, ingredients you can check off as you go, and steps you can actually follow.

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## What's here

Nine real soup recipes, each tagged with the moods they fit. Tap a mood card like "rainy and cozy" or "short on time" and it picks a matching recipe at random. Hit "surprise me instead" if you don't want to choose a mood at all.

Every recipe has:
- A little hand-drawn style bowl illustration, colored to match the soup
- Real ingredients with actual measurements
- Steps you can follow start to finish, not vague suggestions
- Checkboxes next to each ingredient, so you can tick things off as you cook

## How it works, in plain English

- Click a mood, and filter the full recipe list down to just the ones tagged with that mood
- Pick one at random from whatever's left, or from the whole list if you hit "surprise me"
- Draw a little bowl illustration using that recipe's saved color, then list its ingredients and steps
- Checking off an ingredient just crosses it out visually, nothing's saved between visits, so it resets next time you open the page

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Adding your own recipes

All the recipes live in `recipes.js` as a plain array. Each one looks like this:

```js
{
  name: "your soup",
  moods: ["cozy", "quick"],
  time: "30 min",
  servings: 4,
  color: "#d9a441",
  ingredients: ["1 onion, chopped", "..."],
  steps: ["First do this.", "Then do that."],
}
```

The `color` is what tints that soup's bowl illustration, so pick something that feels right for it. A recipe can belong to more than one mood, red lentil soup shows up under both "comfort" and "quick" because honestly, it's both.

## Why moods instead of just a recipe list

I wanted picking a soup to feel like asking a friend what to make, not scrolling through a long list. The mood cards do the narrowing down for you, and "surprise me" is there for when you just want something decided for you.

## License

MIT. Add your own soups, your own moods, your own kitchen.
