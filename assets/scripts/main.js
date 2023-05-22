// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
  'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
  'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
  'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.
  // B1. TODO - Check if 'serviceWorker' is supported in the current browser
  if ('serviceWorker' in navigator) {
    // B2. TODO - Listen for the 'load' event on the window object.

    window.addEventListener('load', () => {
      // B3. TODO - Register './sw.js' as a service worker (The MDN article
      //            "Using Service Workers" will help you here)
      try {
        // B4. TODO - Once the service worker has been successfully registered, console
        //            log that it was successful.
        const registration = navigator.serviceWorker.register("/sw.js");
        if (registration.active) {
          console.log('Service Worker successful:');
        }
      }

      catch (error) {
        // B5. TODO - In the event that the service worker registration fails, console
        //            log that it has failed.
        console.log('Service Worker registration failed');
      }
    });
  }

  // STEPS B6 ONWARDS WILL BE IN /sw.js
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // EXPOSE - START (All expose numbers start with A)
  // A1. TODO - Check local storage to see if there are any recipes.
  //            If there are recipes, return them.

  const alreadyStored = localStorage.getItem("recipes");
  if (alreadyStored) {
    return JSON.parse(alreadyStored);
  }

  /**************************/
  // The rest of this method will be concerned with requesting the recipes
  // from the network


  // A2. TODO - Create an empty array to hold the recipes that you will fetch
  const recipesArr = [];

  // A3. TODO - Return a new Promise. If you are unfamiliar with promises, MDN
  //            has a great article on them. A promise takes one parameter - A
  //            function (we call these callback functions). That function will
  //            take two parameters - resolve, and reject. These are functions
  //            you can call to either resolve the Promise or Reject it.

  return new Promise(async (resolve, reject) => {
    /**************************/
    // A4-A11 will all be *inside* the callback function we passed to the Promise
    // we're returning
    /**************************/


    // A6. TODO - For each URL in that array, fetch the URL - MDN also has a great
    //            article on fetch(). NOTE: Fetches are ASYNCHRONOUS, meaning that
    //            you must either use "await fetch(...)" or "fetch.then(...)". This
    //            function is using the async keyword so we recommend "await"
    // A7. TODO - For each fetch response, retrieve the JSON from it using .json().
    //            NOTE: .json() is ALSO asynchronous, so you will need to use
    //            "await" again
    // A8. TODO - Add the new recipe to the recipes array
    // A9. TODO - Check to see if you have finished retrieving all of the recipes,
    //            if you have, then save the recipes to storage using the function
    //            we have provided. Then, pass the recipes array to the Promise's
    //            resolve() method.
    // A10. TODO - Log any errors from catch using console.error
    // A11. TODO - Pass any errors to the Promise's reject() function

    try {
      // A4. TODO - Loop through each recipe in the RECIPE_URLS array constant
      //            declared above
      for (const recipe of RECIPE_URLS) {

        try {

          const resURL = await fetch(recipe);
          const resJSON = await resURL.json();
          recipesArr.push(resJSON);
        }
        catch (error) {
          console.log(error);
          reject(error);
        }
      }

      if (recipesArr.length === RECIPE_URLS.length) {
        saveRecipesToStorage(recipesArr);
        resolve(recipesArr);
      }
    }
    catch (error) {
      console.log(error);
      reject(error);
    }

  });

}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes = typeof (recipes) == 'string' ? JSON.parse(recipes) : recipes
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}