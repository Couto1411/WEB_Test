const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('8f27c21012e148c19e8b6a8277cec24d',{ corsProxyUrl: 'https://cors-anywhere.herokuapp.com/' });
newsapi.v2.everything({
    q: 'sustentabilidade',
    sortBy: 'publishedAt'
}).then(
    res => handleRes(res)
);
const storiesContainer = document.getElementById('stories-container');
const storyContainer = document.getElementById('story-container');
function handleRes(data) {
    // Access fetched data as array
    let dataArray = Object.entries(data.articles);

    // Create each article using map
    let article, articleContent;
    dataArray.map((story) => {
            // Construct content of each with template literal              
            articleContent = `
            <div class="row pb-2 border-bottom border-secondary">
                <div class="col-lg-4 col-md-6">
                    <img class="img-fluid" src="${story[1].urlToImage}">
                </div>
                <div class="col-lg-8 col-md-6">
                    <a href="${story[1].url}">${story[1].title}</a>
                    <ul class="hidden-mobile">
                        <li>${story[1].description}</li>
                    </ul>
                </div>
            </div>
            `
            article = document.createElement('article');
            article.innerHTML = articleContent;
            console.log(story[1].urlToImage);
            if (story[1].type == "article") {
                storiesContainer.append(article);
        }
   })
}