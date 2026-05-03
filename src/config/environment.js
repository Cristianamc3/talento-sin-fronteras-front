const environments = {
  development: {
    API_URL: 'http://localhost:4000',
    APP_NAME: 'TalentoSinFronteras',
    DEBUG: true,
  },
  production: {
    API_URL: 'https://proyecto-de-software-tatiana-cabrera.onrender.com',
    APP_NAME: 'TalentoSinFronteras',
    DEBUG: false,
  }
};

const env = process.env.REACT_APP_ENV || 'development';

const config = environments[env];

export const getApiBaseUrl = () => config.API_URL;

export default config;