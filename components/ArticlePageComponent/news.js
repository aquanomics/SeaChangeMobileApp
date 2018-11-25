const url =
  "http://seachange.ca-central-1.elasticbeanstalk.com/api/newsarticle?fbclid=IwAR1hn8OhP30Kp3_WTAvJwIG-JoelrY0h1RBKbw2f4z1PdM1w39t2IGTXD6g";

export async function getNews() {
  let result = await fetch(url).then(response => response.json());
  console.log(result);
  return result.NewsArticle;
}