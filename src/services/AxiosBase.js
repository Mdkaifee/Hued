// import axios, {Axios} from 'axios';
// import {clearAllPreferences, getToken, removeToken} from '../utils/UserPrefs';
// import {navigationStrings} from '../utils/constants';
// import {navigationRef} from '../navigators/RouteNavigation';
// // Create a new Axios instance with a base URL and default headers
// let isNavigatingToLogin = false;
// const AxiosBase = axios.create({
//   baseURL: 'https://api.hued.info/api/v1/',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Type': 'multipart/form-data',
//     'ngrok-skip-browser-warning': 'abc',
//   },
// });

// // Request interceptors,
// AxiosBase.interceptors.request.use(
//   async config => {
//     // Add any modifications to the request config, such as adding an authorization token
//     config.headers['token'] = `${await getToken()}`;
//     if (config.data instanceof FormData) {
//       config.headers['Content-Type'] = 'multipart/form-data';
//     } else {
//       config.headers['Content-Type'] = 'application/json';
//     }
//     // console.log(config);
//     console.log('token in config ', await getToken())
//     return config;
//   },
//   error => {
//     // Handle any errors that occur during the request
//     return Promise.reject(error);
//   },
// );

// // Add response interceptors, if needed
// // AxiosBase.interceptors.response.use(
// //   response => {
// //     // Handle the response data, such as extracting the actual data from the response object
// //     return response.data;
// //   },
// //   error => {
// //     // Handle any errors that occur during the response
// //     return Promise.reject(error);
// //   },
// // );
// AxiosBase.interceptors.response.use(
//   response => {
//     return response?.data;
//   },
//   async error => {
//     const {response} = error;
//     console.log('axios401error', response);
//     if (response && response?.status === 401) {
//       if (!isNavigatingToLogin) {
//         isNavigatingToLogin = true;
//         console.log('flagofnavigation', isNavigatingToLogin);
//         console.log('Authentication error detected. Logging out...');
//         removeToken();
//         clearAllPreferences();

//         console.log('Authentication error detected. Logging out...22222');
//         setTimeout(async () => {
//           navigationRef.current?.reset({
//             index: 0,
//             routes: [
//               {
//                 name: navigationStrings?.AuthStackNavigatorAuthenticate,
//                 params: {screen: navigationStrings?.Continue},
//               },
//             ],
//           });
//           isNavigatingToLogin = false; // Reset the flag after navigation
//         }, 700);
//       }

//       console.log('Authentication error detected. Logging out...4234');
//     }
//     return Promise.reject(error);
//   },
// );

// export default AxiosBase;
// // import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {getToken} from '../utils/UserPrefs';

// // const api = axios.create({
// //   baseURL: 'http://3.138.53.108:3002/api/v1/',
// // });

// // // Request interceptor
// // api.interceptors.request.use(
// //   async config => {
// //     const token = await getToken();
// //     console.log('tokenenenenenenenee', token);
// //     if (token) {
// //       config.headers = config.headers ?? {};
// //       config.headers['token'] = `${token}`;

// //       if (config.data instanceof FormData) {
// //         config.headers['Content-Type'] = 'multipart/form-data';
// //       } else {
// //         config.headers['Content-Type'] = 'application/json';
// //       }
// //     }
// //     return config;
// //   },

// //   error => {
// //     return Promise.reject(error);
// //   },
// // );

// // ///Response interceptor
// // api.interceptors.response.use(
// //   response => {
// //     return response;
// //   },
// //   error => {
// //     console.log('erroro', error);

// //     if (error.response) {
// //       if (error.response.status === 401) {
// //         console.log('error response 401', error.response);
// //         // store.dispatch(logoutAction());
// //       }
// //       return Promise.reject(error.response.data);
// //     }

// //     return Promise.reject(error);
// //   },
// // );

// // export default api;
import axios from 'axios';
import {clearAllPreferences, getToken, removeToken} from '../utils/UserPrefs';
import {navigationStrings} from '../utils/constants';
import {navigationRef} from '../navigators/RouteNavigation';

let isNavigatingToLogin = false;

const AxiosBase = axios.create({
  // baseURL: 'https://fab342138629.ngrok-free.app/api/v1/',
  baseURL: 'https://api.hued.info/api/v1/',
  headers: {
    'ngrok-skip-browser-warning': 'abc',
  },
});

// Request interceptor
AxiosBase.interceptors.request.use(
  async config => {
    const token = await getToken();

    // 🔑 Debug logs
    console.log('🔑 Token retrieved before request:', token);

    // Attach token header
    if (token) {
      // If your backend expects Authorization Bearer, use this line instead:
      // config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['token'] = token;
    } else {
      console.warn('⚠️ No token found, request may fail with 401');
    }

    // Handle Content-Type based on body
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // 🚀 Log full request headers for debugging
    console.log('📤 Final Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor
AxiosBase.interceptors.response.use(
  response => {
    return response?.data;
  },
  async error => {
    const {response} = error;
    console.log('❌ axios error:', response?.status, response?.data);

    if (response && response?.status === 401) {
      if (!isNavigatingToLogin) {
        isNavigatingToLogin = true;
        console.log('🚪 Authentication error detected. Logging out...');

        removeToken();
        clearAllPreferences();

        setTimeout(() => {
          navigationRef.current?.reset({
            index: 0,
            routes: [
              {
                name: navigationStrings?.AuthStackNavigatorAuthenticate,
                params: {screen: navigationStrings?.Continue},
              },
            ],
          });
          isNavigatingToLogin = false;
        }, 700);
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosBase;
