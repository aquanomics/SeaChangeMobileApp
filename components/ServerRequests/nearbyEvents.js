const url =
  "http://seachange.ca-central-1.elasticbeanstalk.com/map/getNearbyEvents?";

export async function getEvents(lat,long,distance,limit) {
    let completeurl = url+"lat="+lat+"&long="+long+"&distance="+distance+"&limit="+limit;
    console.log(completeurl);
    let result = await fetch(completeurl).then(response => response.json()).catch((error) => console.log(error));
  //dont forget to add error handling
  console.log("RESULT");
  console.log(result);
  
  return result.result;
}