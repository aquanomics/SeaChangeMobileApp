import { NetInfo } from 'react-native';

export async function isConnected() {
    let result = await NetInfo.isConnected.fetch().catch((error) => console.log(error));
    return result;
}