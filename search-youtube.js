const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v='

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

function displayYouTubeData(data) {
  console.log("Made it to displayYouTubeData");
  console.log(data.kind);  // youtube#searchListResponse
  console.log(data.pageInfo);  // {totalResults: 1000000, resultsPerPage: 5}
  console.log("Start data.items[0]");
  console.log(data.items[0]);
  console.log("End data.items[0]");
  // console.log("Start data.items[0].kind");
  // console.log(data.items[0].kind);
  // console.log("End data.items[0].kind");
  console.log("start data.items[0].id");
  console.log(data.items[0].id);
  console.log("end data.items[0].id");
  console.log("start data.items[0].id.videoId");
  console.log(data.items[0].id.videoId);
  console.log("end data.items[0].id.videoId");
  console.log("The image url follows");
  console.log(data.items[0].snippet.thumbnails.high.url);
  // const results = data.items.map((item, index) => renderResult(item));
  const results = data.items.map(function(item) {
    renderResult(item);
  })
  $('.js-results').html(results);
}

function renderResult(result) {
  const keys = Object.keys(result);
  const values = Object.values(result);
  console.log(keys);
  console.log(values);

  console.log("Leaving renderResult");
  return `
    ${result.items}
  `;
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
