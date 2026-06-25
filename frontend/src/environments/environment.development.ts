// Dev: relative base; proxy.conf.js forwards /lpu-reservation-system/* to BACKEND_URL.
export const environment = {
  production: false,
  apiUrl: '/lpu-reservation-system/api',
  // Backend origin for assets outside the API context (e.g. /uploads).
  backendUrl: 'http://10.1.101.60:8080',
};
