import AxiosBase from './AxiosBase';
import {VARIABLES} from '../utils/globalVariables';
import {saveToken, saveUserPrefs} from '../utils/UserPrefs';

export const SignUpApi = async data => {
  try {
    const response = await AxiosBase.post('user/signup', data);
    console.log('responseSignUp', response);
    const mainToken = response?.result?.accessToken;
    console.log('mainToken', mainToken);
    await saveToken(mainToken);
    await saveUserPrefs(response?.result);
    VARIABLES.details = JSON.stringify(response?.result);
    VARIABLES.lat = response?.result?.location?.coordinates[1];
    VARIABLES.long = response?.result?.location?.coordinates[0];
    console.log('details', VARIABLES.details);
    return response;
  } catch (error) {
    console.log('errorFromSignUp', error);
    return error?.response;
  }
};

export const LoginApi = async data => {
  try {
    const response = await AxiosBase.post('user/login', data);
    console.log('responseLogin', response);
    const mainToken = response?.result?.accessToken;
    console.log('mainToken', mainToken);
    await saveToken(mainToken);
    await saveUserPrefs(response?.result);
    VARIABLES.details = JSON.stringify(response?.result);
    VARIABLES.lat = response?.result?.location?.coordinates[1];
    VARIABLES.long = response?.result?.location?.coordinates[0];
    console.log('details', VARIABLES.details);
    return response;
  } catch (error) {
    console.log('errorFromLogin', error);
    return error?.response;
  }
};

export const ChangePasswordApi = async data => {
  try {
    const response = await AxiosBase.put('user/changedPass', data);
    console.log('response', response);
    return response;
  } catch (error) {
    console.log('changePassword ERROR, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const ContactUsApi = async data => {
  try {
    const response = await AxiosBase.post('user/sendQuery', data);
    return response;
  } catch (error) {
    console.log('Contact Us Errror, FAILLLLL ', error);
    return error.response;
  }
};

export const EditProfileApi = async data => {
  try {
    const response = await AxiosBase.put('user/edit', data);
    await saveUserPrefs(response?.result);
    VARIABLES.details = JSON.stringify(response?.result);
    console.log('details', VARIABLES.details);
    return response;
  } catch (error) {
    console.log('editProfileErrror, FAILLLLL ', error?.response);
    return error.response;
  }
};

export const ForgotPasswordApi = async data => {
  console.log('forgot data email,',data)
  try {
    const response = await AxiosBase.post('user/forgot', data);
    return response;
  } catch (error) {
    console.log('forgotpassword, FAILLLLL ', error);
    return error.response;
  }
};
export const SocialLoginApi = async data => {
  try {
    console.log('data in socialLoginApi',data)
    const response = await AxiosBase.post('user/socialLogin', data);
    const mainToken = response?.result?.accessToken;
    console.log('maintoken from social', response);
    await saveToken(mainToken);
    await saveUserPrefs(response?.result);
    VARIABLES.details = JSON.stringify(response?.result);
    VARIABLES.lat = response?.result?.location?.coordinates[1];
    VARIABLES.long = response?.result?.location?.coordinates[0];
    console.log('details', VARIABLES.details);
    return response;
  } catch (error) {
    console.log('socialLogin, FAILLLLL ', error);
    return error.response;
  }
};
export const SocialLoginBrandApi = async data => {
  try {
    const response = await AxiosBase.post('user/brandSocialLogin', data);
    const mainToken = response?.result?.accessToken;
    console.log('maintoken from social', mainToken);
    await saveToken(mainToken);
    await saveUserPrefs(response?.result);
    VARIABLES.details = JSON.stringify(response?.result);
    VARIABLES.lat = response?.result?.location?.coordinates[1];
    VARIABLES.long = response?.result?.location?.coordinates[0];

    console.log('details', VARIABLES.details);
    return response;
  } catch (error) {
    console.log('socialLogin, FAILLLLL ', error);
    return error.response;
  }
};

export const LogoutApi = async () => {
  try {
    const response = await AxiosBase.get('user/logout');
    return response;
  } catch (error) {
    console.log('logout, FAILLLLL ', error);
    return error.response;
  }
};
