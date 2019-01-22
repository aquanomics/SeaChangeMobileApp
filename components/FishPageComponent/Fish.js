const url = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/listOfSpecies";

export async function getSpecies() {
  let result = await fetch(url).then(response => response.json());
  console.log(result);
  return result.List;
}
