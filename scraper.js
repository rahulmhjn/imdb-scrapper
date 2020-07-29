var fetch = require('node-fetch')
var cheerio = require('cheerio')
var searchurl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q='
var movieurl = 'https://www.imdb.com/title/'

searchCache = {}
movieCache = {}

function searchMovies(searchTerm){

  if(searchCache[searchTerm]){
    console.log("Scrapped from cache: "+searchTerm);
    return Promise.resolve(searchCache[searchTerm]);

  }

  return fetch(`${searchurl}${searchTerm}`)
      .then(response=> response.text())
      .then(body =>{
        const movies = [];
        const $ = cheerio.load(body);
        $('.findResult').each(function(i, element){
          const $element = $(element);
          const $image = $element.find('td a img');
          const $title = $element.find('td.result_text a');
          const imbdID = $title.attr('href').match(/title\/(.*)\//)[1];
          const movie = {
            image: $image.attr('src'),
            title: $title.text(),
            imbdID
          }
          movies.push(movie);
        });

        return searchCache[searchTerm] = movies;
        return movies;
      });
}

function getMovie(imbdID){

  if(getMovie[imbdID]){
    console.log("Scrapped from cache: "+imbdID);
    return Promise.resolve(getMovie[imbdID]);
  }

  return fetch(`${movieurl}${imbdID}`)
      .then(response=> response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1')
        const $rating = $('span[itemprop="ratingValue"]')
        const $runtime = $('time[datetime]')
        const $rate = $('.subtext')


        const title = $title.first().contents().filter(function() {
          return this.type === 'text';
        }).text().trim();

       const rating = $rating.text();
       const runtime = $runtime.first().contents().filter(function() {
         return this.type === 'text';
       }).text().trim();

       const $poster = $('div.poster a img')
       const poster = $poster.attr('src');

       const summary = $('div.summary_text').text().trim()
       const story = $('div.inline p span').text().trim()
       const budget = $('#titleDetails > div:nth-child(12)').text().trim()
       const genres = [];
       $('.subtext a').each(function(i, element) {
       const genre = $(element).text().trim();
       genres.push(genre);
       });
       const released = genres.pop()


        const movie =  {
          imbdID,
          title,
          rating,
          runtime,
          poster,
          summary,
          story,
          budget,
          genres,
          released
        }
        return getMovie[imbdID] = movie;
        return movie;
      })
}

module.exports = {
  searchMovies,
  getMovie
}
