import {selectedApiBaseUrl, selectedS3Url} from './ServerConfig';

export const API_BASE_URL = selectedApiBaseUrl;
export const AWS_S3_BASE_URL = selectedS3Url;
export const REFRESH_TOKEN_URL = '/v1/authentications/refresh-token';
export const SIGN_IN_URL = '/v1/users/token';
export const SIGN_UP_URL = '/v1/users/sign-up/';
export const SIGN_UP_VERIFY_URL = '/v1/users/sign-up';
