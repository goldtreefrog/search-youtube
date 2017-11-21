const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Function: getDataYouTubeAPI
// Get data from YouTube
function getDataYouTubeAPI(searchTerm, callback) {
  const query =  {
    q: searchTerm,
    key: "AIzaSyCdEauiUNN9xGf7BLWzeL0jGm2SF9TUw2s",
    part: 'snippet'
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function displayYouTubeData() {
  console.log("Made it to displayYouTubeData");
}

// Function: watchSubmit
// Wait for user to submit desired search terms
function watchSubmit(){
  console.log("inside watchSubmit");

  $('#js-search').submit(event => {
    event.preventDefault();
    console.log("User clicked Submit button");

    const inputField = $(event.currentTarget).find('.js-search-words');
    const userKeywords = inputField.val();
    console.log(userKeywords);

    // clear out the input
    inputField.val("");

    getDataYouTubeAPI(userKeywords, displayYouTubeData);
  })
}

$(watchSubmit);
