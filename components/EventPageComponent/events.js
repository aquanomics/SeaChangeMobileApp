const url = "http://seachange.ca-central-1.elasticbeanstalk.com/api/events"

export async function getEvent(){
	let result = await fetch(url).then(response => response.json());
	console.log(result);
	return result.Event;
}
