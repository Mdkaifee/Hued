import AxiosBase from './AxiosBase';
import {VARIABLES} from '../utils/globalVariables';
import {saveToken, saveUserPrefs} from '../utils/UserPrefs';
import { jsonGetAll } from '@react-native-firebase/app';

export const GetColorsApi = async data => {
  try {
    const response = await AxiosBase.post('user/getColors', data);
    // VARIABLES.url = JSON.stringify(response?.result?.url);
    // console.log('url', JSON.parse(VARIABLES.url));
    return response;
  } catch (error) {
    console.log('Get Colors Api, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const uploadImages = async data => {
  console.log('[uploadImages] request payload:', JSON.stringify(data));
  try {
    const response = await AxiosBase.post('user/uploadFile', data);
    console.log('[uploadImages] raw response:', JSON.stringify(response));

    const normalizedResult = Array.isArray(response?.result)
      ? response
      : {
          ...response,
          result: Array.isArray(response)
            ? response
            : response?.result
            ? [response.result]
            : [],
        };

    const firstFileUrl = normalizedResult?.result?.[0]?.file;
    if (firstFileUrl) {
      VARIABLES.url = JSON.stringify(firstFileUrl);
      console.log('[uploadImages] first file URL:', firstFileUrl);
    }

    if (!normalizedResult?.responseCode && normalizedResult?.result?.length) {
      normalizedResult.responseCode = 200;
    }

    return normalizedResult;
  } catch (error) {
    console.log('Upload api error', error?.response);
    return error.response;
  }
};

export const GetCategoriesApi = async () => {
  try {
    const response = await AxiosBase.get('user/categories');
    return response;
  } catch (error) {
    console.log('get categoriess api, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const AddnewCategoryApi = async data => {
  try {
    const response = await AxiosBase.post('user/addCategory', data);
    return response;
  } catch (error) {
    console.log('add newww category, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const createOutfitApi = async data => {
  try {
    const response = await AxiosBase.post('user/createOutfit', data);

    return response;
  } catch (error) {
    console.log('create outfit, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const GetHomeApi = async () => {
  try {
    const response = await AxiosBase.get('user/home');
    return response;
  } catch (error) {
    console.log('get categoriess api, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const exploreApi = async data => {
  try {
    const response = await AxiosBase.post('user/explore', data);

    return response;
  } catch (error) {
    console.log('explore, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const WardrobeApi = async data => {
  try {
    const response = await AxiosBase.put(`user/wardrobe/${data}`);

    return response;
  } catch (error) {
    console.log('wardrobee, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const GetWardrobeApi = async (page, limit, search) => {
  try {
    const response = await AxiosBase.get(
      `user/wardrobeList?page=${page}&limit=${limit}&search=${search}`,
    );
    return response;
  } catch (error) {
    console.log('get wardrobe api, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const GetViewsApi = async id => {
  try {
    const response = await AxiosBase.get(`user/viewOutfit?_id=${id}`);
    return response;
  } catch (error) {
    console.log('get viewss api, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const postCollectionsApi = async data => {
  try {
    const response = await AxiosBase.post('user/createCollection', data);

    return response;
  } catch (error) {
    console.log('addcollection, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const updateCollectionApi = async data => {
  console.log('data in update collection ', data);
  try {
    const response = await AxiosBase.put('user/updateCollection', data);
    return response;
  } catch (error) {
    console.log('update collection, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const GetWardrobeCollectionApi = async (page, limit, search) => {
  try {
    const response = await AxiosBase.get(
      `user/listCollections?page=${page}&limit=${limit}&search=${search}`,
    );
    return response;
  } catch (error) {
    console.log('get wardrobe collection api , FAILLLLL ', error?.response);
    return error.response;
  }
};

export const addOutfitInCollectionApi = async data => {
  try {
    const response = await AxiosBase.post('user/addOutfitToCollection', data);

    return response;
  } catch (error) {
    console.log('outfitincollection, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const GetExploreCollectionApi = async id => {
  try {
    const response = await AxiosBase.get(`user/listCollections?_id=${id}`);
    return response;
  } catch (error) {
    console.log('get explore collection api , FAILLLLL ', error?.response);
    return error.response;
  }
};

export const removeOutfitInCollectionApi = async (id, cId) => {
  try {
    const response = await AxiosBase.delete(
      `user/removeOutfitToCollection?_id=${id}&collectionId=${cId}`,
    );
    return response;
  } catch (error) {
    console.log(
      'get remove outfit from collection api , FAILLLLL ',
      error?.response,
    );
    return error.response;
  }
};

export const removeCollectionApi = async id => {
  try {
    const response = await AxiosBase.delete(`user/removeCollection/${id}`);
    return response;
  } catch (error) {
    console.log(
      'get wardrobe remove  collection api , FAILLLLL ',
      error?.response,
    );
    return error.response;
  }
};

export const deleteOutfitFromHomeApi = async id => {
  try {
    const response = await AxiosBase.delete(`user/deleteOutfit?_id=${id}`);
    return response;
  } catch (error) {
    console.log(
      ' delete from home  collection api , FAILLLLL ',
      error?.response,
    );
    return error.response;
  }
};

export const publicPrivateApi = async id => {
  try {
    const response = await AxiosBase.put(`user/publicOutfit?_id=${id}`);

    return response;
  } catch (error) {
    console.log('public/privateeincollection, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const updateOutfitApi = async data => {
  try {
    const response = await AxiosBase.put('user/updateOutfit', data);
    return response;
  } catch (error) {
    console.log('update outfit, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const postRecommendationsApi = async data => {
  try {
    const response = await AxiosBase.post('user/suggestions', data);
    return response;
  } catch (error) {
    console.log('post recommendation, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const notificationsApi = async (page, limit) => {
  try {
    const response = await AxiosBase.get(
      `user/notificationList?page=${page}&limit=${limit}`,
    );
    return response;
  } catch (error) {
    console.log('post recommendation, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const updateTokenApi = async data => {
  try {
    const response = await AxiosBase.put('user/updateToken', data);
    return response;
  } catch (error) {
    console.log('update token, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const deleteAccountApi = async id => {
  try {
    const response = await AxiosBase.delete('user/deleteProfile');
    return response;
  } catch (error) {
    console.log(' delete account api , FAILLLLL ', error?.response);
    return error.response;
  }
};
