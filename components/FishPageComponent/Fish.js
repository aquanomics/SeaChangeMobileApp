const url = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/listOfSpecies";
const url2 = 
   "http://seachange.ca-central-1.elasticbeanstalk.com/api/speciesInfo?specCode=";
const url3 =
	"http://seachange.ca-central-1.elasticbeanstalk.com/api/fishSearch?search=";
export async function getSpecies(offset, code) {
  let result = await fetch(url+"?offset="+offset+"&areaCode="+code).then(response => response.json());
  console.log(result);
  return result.List;
}

export async function getSpeciesDetails(SpecCode) {
  let result = await fetch(url2+SpecCode).then(response => response.json());
  console.log(result);
  return result.SpeciesInfo;
}

export async function getSpeciesSearch(offset,keyword) {
  let result = await fetch(url3+keyword+"&offset="+offset).then(response => response.json());
  console.log(result);
  console.log(keyword);
  console.log(url3+keyword+"&offset="+offset);
  return result.List;
}
