import { NetInfo } from 'react-native';

export async function isConnected() {
  const result = await NetInfo.isConnected.fetch().then((isConnected) => {
    if (isConnected) {
      console.log('Internet is connected');
    } else {
      console.log('Internet is not connected');
    }
  }).catch(error => console.log(error));
  console.log(result);
  return result;
}
