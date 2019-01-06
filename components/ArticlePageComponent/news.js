const url =
  "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?category=";

export async function getNews(category) {
  let result = await fetch(url+category).then(response => response.json());
  console.log(result);
  return result.NewsArticle;
}
