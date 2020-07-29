var express = require('express')
var scraper = require('./scraper')

var cors = require('cors');

var app = express()
app.use(cors());
var port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.json({
    message: "Scrapping is Fun"
  })
})

//*/search/sholay
//*/search/fight club
app.get('/search/:title',(req,res)=>{
  scraper
      .searchMovies(req.params.title)
      .then(movies=>{
        res.json(movies);
      })
})

app.get('/movie/:imbdID',(req,res)=>{
  scraper
      .getMovie(req.params.imbdID)
      .then(movie => {
        res.json(movie);
      })
})

app.listen(port, ()=>{
  console.log(`listening at port ${port}`)
})
