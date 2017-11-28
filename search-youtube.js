// Use YouTube API to return thumbnails of videos that match the user-supplied keywords.
// by Margaret Blauvelt, 23 Nov 2017. Last update: 28 Nov 2017.
//
// See API Documentation: https://developers.google.com/youtube/
// Sample JSON: https://www.googleapis.com/youtube/v3/search?q=cats&key=AIzaSyCdEauiUNN9xGf7BLWzeL0jGm2SF9TUw2s&part=snippet

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';
const NBR_COLUMNS = 6;
const MAX = 12;

// Function: getDataYouTubeAPI
// Get data from YouTube
function getDataYouTubeAPI(searchTerm, callback) {  // second
  const query =  {
    q: searchTerm,    // the keywords the user entered
    key: "AIzaSyCdEauiUNN9xGf7BLWzeL0jGm2SF9TUw2s",  // see API documentation
    part: "snippet",  // the key to the hash that we want
    type: "video",    // nothing but videos
    maxResults: MAX    // Enough results to fill one of our pages
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

// Function: displayYouTubeData
// Display videos on the page.
function displayYouTubeData(data) {  // third
  let cnt = 0;
  console.log("Made it to displayYouTubeData");
  console.log(data.kind);  // youtube#searchListResponse
  console.log(data.pageInfo);  // {totalResults: 1000000, resultsPerPage: 5}
  console.log(data.pageInfo.totalResults);  // mjb Add to user page
  if (data.pageInfo.totalResults != 0) {
    console.log("Start data.items[0]");
    console.log(data.items[0]);
    console.log("End data.items[0]");
    console.log("start data.items[0].id");
    console.log(data.items[0].id);
    console.log("end data.items[0].id");
    console.log("start data.items[0].id.videoId");
    console.log(data.items[0].id.videoId);
    console.log("end data.items[0].id.videoId");
    console.log("The image url follows");
    console.log(data.items[0].snippet.thumbnails.high.url);
  }
  const results = data.items.map(function(item) {
    let itemHtml = renderResult(item, cnt);   // One video at a time
    cnt += 1;
    return itemHtml;
  })

  console.log("HTML results:");
  console.log(results);
  console.log("End HTML results");
  // $('.js-result-area').prop('hidden', false);
  if (data.pageInfo.totalResults === 0) {
    $('.js-results').html('<div class="js-total">No videos match the search criteria you entered. Please try again.</div>');
  } else {
     // .toLocaleStrong()  (below) may not yet work in all browsers to insert comma separators, but apparently the worst thing that will happen is nothing at all.
    $('.js-results').html(`<div class="js-total">Showing 1 to ${cnt} of ${data.pageInfo.totalResults.toLocaleString()} total results:</div>`);
    $('.js-results').append(results.join(""));
  }
}

// Function: renderResult
// Return HTML for a single item.
function renderResult(result, cnt) {  // fourth
  const keys = Object.keys(result);
  const values = Object.values(result);
  console.log(keys);
  console.log(values);
  let colClass = 12 / NBR_COLUMNS
  let itemHtml = `<div id="t-${cnt}" class="thumb col-${colClass}"><figure><figcaption>${result.snippet.title}</figcaption><a href="${YOUTUBE_WATCH_URL}${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.title}"></a></figure></div>`
  if (cnt % NBR_COLUMNS === 0) {
    itemHtml = '<div class="row">' + itemHtml
  } else {
    if ( (cnt + 1) % NBR_COLUMNS === 0 ) {
      itemHtml += '</div>'
    }
  }

  console.log("Leaving renderResult");
  return itemHtml;
}

// Function: watchSubmit
// Wait for user to submit desired search terms
function watchSubmit(){  // first
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
