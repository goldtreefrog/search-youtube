// Use YouTube API to return thumbnails of videos that match the user-supplied keywords.
// by Margaret Blauvelt, 23 Nov 2017. Last update: 28 Nov 2017.
//
// See API Documentation: https://developers.google.com/youtube/
// Sample JSON: https://www.googleapis.com/youtube/v3/search?q=cats&key=AIzaSyCdEauiUNN9xGf7BLWzeL0jGm2SF9TUw2s&part=snippet

// Youtube search URL: 'https://www.googleapis.com/youtube/v3/search' - found in getDataYouTubeAPI() below
// YouTube watch URL: 'https://www.youtube.com/watch?v=' - found in renderResult() below. Simply append the video ID to the following string to make a link to that video.
// nbrCols = 6: - found in renderResult(). The maximum number of columns for the widest displays.
// maxResults: 12 - found in getDataYouTubeAPI. The number of results for one of our pages.

// Function: getDataYouTubeAPI
// Get data from YouTube
// Parameters from watchSubmit: userKeywords, displayYouTubeData, nextPageToken
function getDataYouTubeAPI(searchTerm, callback, nextPageToken) {  // second
  const query =  {
    q: searchTerm,    // the keywords the user entered
    key: "AIzaSyCdEauiUNN9xGf7BLWzeL0jGm2SF9TUw2s",  // see API documentation
    part: "snippet",  // the key to the hash that we want
    type: "video",    // nothing but videos
    maxResults: 12    // Enough results to fill one of our pages
  }
  if (nextPageToken) {
   query.pageToken = nextPageToken;
 }

  $.getJSON("https://www.googleapis.com/youtube/v3/search", query, callback);
}

// Function: displayYouTubeData
// Display videos on the page.
function displayYouTubeData(data) {  // third
// function displayYouTubeData(dataAndPg) {  // third
//   let data = dataAndPg[0];
  let searchTerms = $('#js-search-terms').html();
  let pageCnt = $('#js-page-count').html() || 1;
  let cnt = 0;
  const results = data.items.map(function(item) {
    let itemHtml = renderResult(item, cnt);   // One video at a time
    cnt += 1;
    return itemHtml;
  })

  if (data.pageInfo.totalResults === 0) {
    $('.js-results').html('<div class="js-total">No videos match the search criteria you entered. Please try again.</div>');
  } else {
     // .toLocaleStrong()  (below) may not yet work in all browsers to insert comma separators, but apparently the worst thing that will happen is nothing - no commas.
    $('.js-results').html(`<div class="js-total">Showing ${(pageCnt * 12 - 11)} to ${((pageCnt - 1) * 12 + cnt)} of ${data.pageInfo.totalResults.toLocaleString()} total results:</div>`);
    $('.js-results').append(results.join(""));
    $('#js-search-terms').html(searchTerms);
    $('#js-next-page').html(data.nextPageToken);

    // Hide next page link if there is no next page
    if (data.pageInfo.totalResults > pageCnt * 12) {
      $('#js-next-page-link').prop('hidden', false);
    } else {
      $('#js-next-page-link').prop('hidden', true);
    }

    $('#js-page-count').html(++pageCnt);
  }
}

// Function: renderResult
// Return HTML for a single item.
function renderResult(result, cnt) {  // fourth
  let nbrCols = 6;
  let colClass = 12 / nbrCols
  let itemHtml = `<div id="t-${cnt}" class="thumb col-${colClass}"><figure><figcaption>${result.snippet.title}</figcaption><a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.title}"></a></figure></div>`
  if (cnt % nbrCols === 0) {
    itemHtml = '<div class="row">' + itemHtml
  } else {
    if ( (cnt + 1) % nbrCols === 0 ) {
      itemHtml += '</div>'
    }
  }

  return itemHtml;
}

// Function: watchSubmit
// Wait for user to submit desired search terms
function watchSubmit(){  // first

  $('#js-search').submit(event => {
    event.preventDefault();

    // Clear the data fields from previous searches
    $('#js-next-page').html("");
    $('#js-page-count').html("");

    const inputField = $(event.currentTarget).find('.js-search-words');
    const userKeywords = inputField.val();
    const nextPageToken = $.trim($('#js-next-page').html());

    // copy the input and clear out the input field (though personally I would prefer a "clear" button... Phase 3)
    $('#js-search-terms').html(inputField.val());
    inputField.val("");

    getDataYouTubeAPI(userKeywords, displayYouTubeData, nextPageToken);
  });

  // When user clicks "Next Page", show the next page from YouTube
  $('#js-next').on('click', function(e) {
    const userKeywords = $('#js-search-terms').html();
    const nextPageToken = $.trim($('#js-next-page').html());

    getDataYouTubeAPI(userKeywords, displayYouTubeData, nextPageToken);
  });
}

$(watchSubmit);
