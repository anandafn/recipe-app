import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { INIT_PAGE, MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Render the Recipe
const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    // 1. Load the recipe
    // Render the spinner
    recipeView.renderSpinner();

    // Update results view by marking the selected search result
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Since we are using async in the model.js for the loadRecipe, then we need to await it
    await model.loadRecipe(id);

    // 2. Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.errorHandler();
  }
};

// Handle the search result
const controlSearchResult = async () => {
  try {
    // Handle the spinner
    resultsView.renderSpinner();

    // Get query value from the input search
    const query = searchView.getQuery();
    if (!query) return;

    // Load the search results
    await model.loadSearchResult(query);

    // Render the results
    resultsView.render(model.getSearchResultsPage(INIT_PAGE));

    // Render the pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// // Make the URL id change whenever the user click onto the new recipe
// window.addEventListener('hashchange', showRecipe);

// // Make the page loadable in a new tab, even if its already open in another tabs
// window.addEventListener('load', showRecipe);

// This line of code has the same functionality as the above code, but in more dinamically
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipe)
// );

const controlPagination = goToPage => {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render the pagination
  paginationView.render(model.state.search);
};

const controlServing = newServing => {
  // Update the recipe serving
  model.updateServings(newServing);

  // Update the recipe UI
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // render loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the new added recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.messageHandler();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      // addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.errorHandler(err);
  }
};

const newFeature = () => {
  console.log('Welcome to the app');
};

// We want to do this in the beginning and only once
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
