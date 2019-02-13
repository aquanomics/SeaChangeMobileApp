const url = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/listOfSpecies";
const url2 = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/speciesInfo?specCode=";

export async function getSpecies(offset) {
  let result = await fetch(url+"?offset="+offset).then(response => response.json());
  console.log(result);
  return result.List;
}

export async function getSpeciesDetails(SpecCode) {
  let result = await fetch(url2+SpecCode).then(response => response.json());
  console.log(result);
  return result.SpeciesInfo;
}
