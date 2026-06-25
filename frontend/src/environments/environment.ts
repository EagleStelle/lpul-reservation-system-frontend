// Production defaults. Replaced by environment.development.ts in dev builds.
export const environment = {
  production: true,
  // Backend context + API prefix. Prepend a host if served separately in prod.
  apiUrl: '/lpu-reservation-system/api',
  // Backend origin (scheme+host+port) for assets served outside the API context
  // (e.g. /uploads). Set to the deployment's backend host.
  backendUrl: 'http://10.1.101.60:8080',
};
