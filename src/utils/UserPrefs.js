import AsyncStorage from './AsyncStorage.js';

const USER_PREFS = 'USER_PREFS';
const TOKEN = 'TOKEN';
const IS_LOGGED_IN = 'IS_LOGGED_IN';

export const KEYS = {
  userType: 'USER_TYPE',
  emailAddress: 'EMAIL_ADDRESS',
  lat: 'LAT',
  long: 'LONG',
};

export const registeredEvents = {
  EDIT_PROFILE: 'EDIT_PROFILE',
  EXPLORE: 'EXPLORE',
  APPLE_EMAIL: 'APPLE_EMAIL',
  COLLECTION: 'COLLECTION',
  OUTFIT_REMOVE: 'OUTFIT_REMOVE',
};
export const saveUserPrefs = async data => {
  try {
    await AsyncStorage.setItem(USER_PREFS, JSON.stringify(data));
  } catch (error) {
    console.log('Error while saving user : ', error);
  }
};

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('Error while saving user : ', error);
  }
};

export const getUserPrefs = async () => {
  try {
    return await AsyncStorage.getItem(USER_PREFS);
  } catch (e) {
    console.log('Error while Get User : ', e);
    return null;
  }
};

export const getData = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log('Error while Get User : ', e);
    return null;
  }
};

export const removeUserPrefs = async () => {
  try {
    await AsyncStorage.removeItem(USER_PREFS);
  } catch (error) {
    console.log('Error while removing user : ', error);
  }
};

export const saveToken = async token => {
  try {
    await AsyncStorage.setItem(TOKEN, token);
  } catch (error) {
    console.log('Error while saving token : ', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN);
  } catch (e) {
    console.log('Error while Get token : ', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN);
  } catch (error) {
    console.log('Error while removing token : ', error);
  }
};

export const saveIsLoggedIn = async flag => {
  try {
    await AsyncStorage.setItem(IS_LOGGED_IN, String(flag));
  } catch (error) {
    console.log('Error while Is Logged In Save : ', error);
  }
};

export const checkIsLoggedIn = async () => {
  try {
    return await AsyncStorage.getItem(IS_LOGGED_IN);
  } catch (e) {
    console.log('Error while Check is Logged in : ', e);
    return null;
  }
};

export const clearAllPreferences = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Error while clearing preferences : ', error);
  }
};
