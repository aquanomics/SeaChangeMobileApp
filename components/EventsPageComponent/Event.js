const url = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/events";

const url2 =
	"http://seachange.ca-central-1.elasticbeanstalk.com/api/eventcities";

export async function getEvents(city) {
  let result = await fetch(url+"?city="+city).then(response => response.json());
  console.log(result);
  return result.Events;
}

export async function getCities() {
  let result = await fetch(url2).then(response => response.json());
  console.log(result);
  return result.Cities;
}

