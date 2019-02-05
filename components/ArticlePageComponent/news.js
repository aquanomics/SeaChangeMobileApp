const urlCategory = "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?";
const urlSearch= "http://seachange.ca-central-1.elasticbeanstalk.com/api/articleSearch?";
//const urlSearch= "http://seachange.ca-central-1.elasticbeanstalk.com/api/articleSearch?search=";

export async function getNews(category, offset, limit) {
    console.log(`category: ${category} offset: ${offset} limit: ${limit}`);
    let result = await fetch(urlCategory + "category=" + category + "&offset=" + offset + "&limit=" + limit).then(response => response.json());
    console.log("Below is the result for NewsArticle");
    console.log(result);
    return result.NewsArticle;
}

//NOTE: I know the code looks like it's requesting a GET request on a url that has spaces/' 's
//but the 'fetch' function is smart enough and encodes the spaces into '+'s which is standard practice.
//Also, the backend's Express is smart enough to convert the '+' encoding into ' '.
//Therefore, on the backend code, the url will have the '+', but when you extract the parameters through
//express' functions, they will be converted to ' '
export async function getArticleSearch(search, offset, limit) {
    console.log(`search: ${search} offset: ${offset} limit: ${limit}`);

    let result = await fetch(urlSearch + `search=${search}&offset=${offset}&limit=${limit}`).then(response => response.json());

    console.log("Below is the result for article search");
    console.log(result);

    //Warning: It says NewsArticle because I didn't change backend to pass back the array as SearchArticle
    if (result.NewsArticle === undefined || (result.NewsArticle.length == 0 && offset == 0) )
	return {SearchArticle: result.NewsArticle, emptySearchReturned: true};
    else
	return {SearchArticle: result.NewsArticle, emptySearchReturned: false};
}

//when doing the above, check (length is 0 AND offset != 0), if so then return empty list
