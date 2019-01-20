const urlCategory = "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?category=";
const urlSearch= "http://seachange.ca-central-1.elasticbeanstalk.com/api/articleSearch?search=";

export async function getNews(category) {
    let result = await fetch(urlCategory+category).then(response => response.json());
    console.log(result);
    return result.NewsArticle;
}

export async function getArticleSearch(search) {
    //cannot encode ' ' into the URL. Therefore, split and use '+'
    //Gives the same result if there is only one keyword separated by ' '
    
    var encodedSearchArr = search.split(' ');
    var encodedSearch = '';
    for(var i = 0; i < encodedSearchArr.length; i++) {
	if(i !== 0)
	    encodedSeach += '+';
	encodedSearch += encodedSearchArr[i];
    }

    console.log(encodedSearch);
    
    let result = await fetch(urlSearch + encodedSearch).then(response => response.json());
    console.log("getArticleSearch() has been invoked");
    console.log(result);
    return result.NewsArticle;
}
