export const API_CODE = import.meta.env.VITE_API_CODE || process.env.VITE_API_CODE;
export const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;
export const API_PARAMS = `code=${API_CODE}&clientId=default`;

const API_PATHS = {
  product: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  import: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  cart: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
};

export default API_PATHS;
