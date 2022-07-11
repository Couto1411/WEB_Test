const reponse =fetch("https://content.guardianapis.com/search?q=sustainability&show-fields=all&show-blocks=body&api-key=test").then(
    res => res.json()
).then(
    res => handleRes(res)
).catch(ex =>
    console.error(ex)
);
const storiesContainer = document.getElementById('stories-container');
const storyContainer = document.getElementById('story-container');
function handleRes(data) {
    // Access fetched data as array
    let dataArray = Object.entries(data.response.results);

    // Create each article using map
    let article, articleContent;
    dataArray.map((story) => {

        // Construct content of each with template literal              
        articleContent = `
        <div class="row pb-2 border-bottom border-secondary">
            <div class="col-lg-4 col-md-6">
                <img class="img-fluid" src="${story[1].fields.thumbnail}">
            </div>
            <div class="col-lg-8 col-md-6">
                <a href="${story[1].webUrl}">${story[1].webTitle}</a>
                <ul class="hidden-mobile">
                    <li>${story[1].fields.trailText}</li>
                </ul>
            </div>
        </div>
        `
        article = document.createElement('article');
        article.innerHTML = articleContent;
        if (story[1].type == "article") {
            storiesContainer.append(article);
        }
   })
}