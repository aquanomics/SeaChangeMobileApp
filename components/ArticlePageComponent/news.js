const urlCategory = "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?category=";
const urlSearch= "http://seachange.ca-central-1.elasticbeanstalk.com/api/articleSearch?search=";

export async function getNews(category) {
    let result = await fetch(urlCategory+category).then(response => response.json());
    console.log(result);
    return result.NewsArticle;
}

export async function getArticleSearch(search) {
    let result = await fetch(urlSearch+search).then(response => response.json());
    console.log("getArticleSearch() has been invoked");
    console.log(result);
    return result.NewsArticle;
}
