import NetInfo from '@react-native-community/netinfo';

// Helper function to fetch data with automatic network connection checks
export async function fetchWithNetworkCheck(apiFunction) {
  // Check the initial network connection status
  const initialState = await NetInfo.fetch();

  // If the connection is available, execute the API function
  if (initialState.isConnected) {
    return await apiFunction();
  }

  // Return a Promise that resolves when the network connection is restored
  return new Promise((resolve, reject) => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected) {
        try {
          const data = await apiFunction();
          resolve(data);
        } catch (error) {
          reject(error);
        } finally {
          unsubscribe();
        }
      }
    });
  });
}
