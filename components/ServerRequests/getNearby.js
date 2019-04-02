/* eslint-disable import/prefer-default-export */
/* eslint-disable no-useless-concat */
const url = 'http://seachange.ca-central-1.elasticbeanstalk.com/map/';


export async function getNearby(queryName, lat, long, distance, limit) {
  const completeurl = `${url + queryName}?` + `lat=${lat}&long=${long}&distance=${distance}&limit=${limit}`;
  console.log(completeurl);
  const result = await fetch(completeurl).then(response => response.json()).catch(error => console.log(error));
  // dont forget to add error handling
  console.log('RESULT');
  console.log(result);

  return result.result;
}
// getNearbyArticles?
