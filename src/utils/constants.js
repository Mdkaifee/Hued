import {Dimensions} from 'react-native';

export const API_BASE_URL = 'https://api.example.com';
export const API_ENDPOINTS = {
  getUsers: '/users',
  getPosts: '/posts',
};

export const navigationStrings = {
  AuthStackNavigatorAuthenticate: 'AuthStackNavigator',
  Continue: 'ContinueAs',
};

export const s3baseUrl = 'https://pushyy-app.s3.amazonaws.com/';
export const GOOGLE_API_KEY = 'AIzaSyDjy4uaw0JEkpf4B7YIlWojcCgI0jxYlBs';

export const FONT_FAMILIES = {
  bold: 'DMSans-Bold',
  semiBold: 'DMSans-SemiBold',
  medium: 'DMSans-Medium',
  regular: 'DMSans-Regular',
  prata: 'Prata-Regular',
  tenor: 'TenorSans-Regular',
};

export const COLORS = {
  primary: '#DD8560',
  white: '#FFFFFF',
  light: '#403f3b',
  black: '#000000',
  textBlack: '#454545',
  borderLine: '#26261E',
  lightBlack: '#00000099',
  borderBlack: '#37372D',
  transparent: '#F9F9F9',
  border: '#E1E1D9',
  lightText: '#0000004D',
  lightBorderLine: '#D4D4D4',
  bgColor: '#f0f0f0',
  outer: '#00000033',
  lightest: '#ededed',
  
};

export const ActionTypes = {
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
  // ...
};

export const FONT_SIZES = {
  eight: 8,
  ten: 10,
  twelve: 12,
  fourteen: 14,
  sixteen: 16,
  eighteen: 18,
  twenty: 20,
  twentyTwo: 22,
  twentyFour: 24,
  twentySix: 26,
  twentyEight: 28,
  thirty: 30,
  thirtyTwo: 32,
  thirtyFour: 34,
  thirtySix: 36,
  thirtyEight: 38,
  forty: 40,
};
export const PAGE_SIZE = 10;
export const DATE_FORMAT = 'MM/DD/YYYY';

export const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} =
  Dimensions.get('window');
