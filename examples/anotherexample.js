import FetchHelper from '../src/fetchHelper.js';

// Select the button and joke div from the DOM
const button = document.querySelector(".container button");
const jokeDiv = document.querySelector(".container .joke p");

// Load a joke when the document is loaded
document.addEventListener("DOMContentLoaded", getJoke);

// Fetch a new joke whenever the button is clicked
button.addEventListener("click", () => {
  console.log("Button clicked. Fetching a new joke...");
  FetchHelper.clearCache();  // Clear cache for debugging purposes
  getJoke();
});

// Function to get a joke using FetchHelper
async function getJoke() {
  const url = "https://icanhazdadjoke.com/";
  try {
    console.log("Requesting joke from API...");

    // Use FetchHelper to fetch the joke data
    const jokeData = await FetchHelper.get(url, {
      headers: {
        Accept: "application/json"
      }
    });

    // Log the entire response to verify its structure
    console.log("Fetched joke data:", jokeData);

    // Update jokeDiv only if jokeData and jokeData.joke exist
    if (jokeData && jokeData.joke) {
      jokeDiv.innerHTML = jokeData.joke;
    } else {
      jokeDiv.innerHTML = "Oops, couldn't fetch a joke. Try again!";
    }
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    jokeDiv.innerHTML = "Oops, couldn't fetch a joke. Try again!";
  }
}
