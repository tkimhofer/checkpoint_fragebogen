export const API_ROOT = "/v1";

export const buildApiUrl = (
  origin: string,
  path: string
) => `${origin}${API_ROOT}${path}`;