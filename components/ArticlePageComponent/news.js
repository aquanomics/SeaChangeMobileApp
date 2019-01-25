const urlCategory = "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?category=";
const urlSearch= "http://seachange.ca-central-1.elasticbeanstalk.com/api/articleSearch?search=";

export async function getNews(category) {
    let result = await fetch(urlCategory+category).then(response => response.json());
    return result.NewsArticle;
}

//NOTE: I know the code looks like it's requesting a GET request on a url that has spaces/' 's
//but the 'fetch' function is smart enough and encodes the spaces into '+'s which is standard practice.
//Also, the backend's Express is smart enough to convert the '+' encoding into ' '.
//Therefore, on the backend code, the url will have the '+', but when you extract the parameters through
//express' functions, they will be converted to ' '
export async function getArticleSearch(search) {
    let result = await fetch(urlSearch + search).then(response => response.json());

    if (result.NewsArticle === undefined || result.NewsArticle.length == 0)
	return {SearchArticle: result.NewsArticle, emptySearchReturned: true};
    else
	return {SearchArticle: result.NewsArticle, emptySearchReturned: false};
}
