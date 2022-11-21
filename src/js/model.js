import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helpers.js';
import { API_KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    serving: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResult = async query => {
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}?key=${API_KEY}`);
    console.log(data);

    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; // for exampe page 1, then the data will load from index 0
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end); // for example page 1, then we will get data from index 0 - 9
};

export const updateServings = newServing => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing / state.recipe.serving);
  });

  state.recipe.serving = newServing;
};

// Store the bookmarks
const storeBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  // add the recipe to the array
  state.bookmarks.push(recipe);

  // Marking the selected recipe as bookmarked recipe
  // state.recipe.id means the current recipe that is currently openned in the application
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookmarks();
};

export const deleteBookmark = id => {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Set the recipe to false, because it is no longer bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmarks();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// in case we need to clear the bookmark storage
const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        const [quantity, unit, description] = ingArr;

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, Please use the correct format'
          );

        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    const newRecipeData = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // console.log(newRecipeData);

    state.recipe = createRecipeObject(newRecipeData);
    // console.log(state.recipe);
    // console.log(recipe);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
