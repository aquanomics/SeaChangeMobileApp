const url = 'http://seachange.ca-central-1.elasticbeanstalk.com/api/events';

const url2 =	'http://seachange.ca-central-1.elasticbeanstalk.com/api/eventcities';

const url3 =	'http://seachange.ca-central-1.elasticbeanstalk.com/api/eventSearch';

export async function getEvents(city) {
  const result = await fetch(`${url}?city=${city}`).then(response => response.json());
  return result.Events;
}

export async function getCities() {
  const result = await fetch(url2).then(response => response.json());
  return result.Cities;
}

export async function searchEvents(offset, keyword) {
  const result = await fetch(`${url3}?offset=${offset}&search=${keyword}`).then(response => response.json());
  return result.List;
}
