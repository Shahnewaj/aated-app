const serverSelection = (targetServer: string) => {
  switch (targetServer) {
    case 'production':
      return {
        baseUrl: 'https://api.aated.net/api',
        s3Url: '',
      };
    default:
      return {
        baseUrl: 'https://api.aated.net/api',
        s3Url: '',
      };
  }
};

export const targetServer = 'stage';

export const selectedApiBaseUrl = serverSelection(targetServer).baseUrl;
export const selectedS3Url = serverSelection(targetServer).s3Url;
