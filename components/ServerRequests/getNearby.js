const url =
  "http://seachange.ca-central-1.elasticbeanstalk.com/map/";

export async function getNearby(queryName, lat,long,distance,limit) {
    let completeurl = url+queryName+"?"+"lat="+lat+"&long="+long+"&distance="+distance+"&limit="+limit;
    console.log(completeurl);
    let result = await fetch(completeurl).then(response => response.json()).catch((error) => console.log(error));
  //dont forget to add error handling
  console.log("RESULT");
  console.log(result);
  
  return result.result;
}
//getNearbyArticles?