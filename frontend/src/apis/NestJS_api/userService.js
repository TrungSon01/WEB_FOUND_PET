import { https_nest } from "./config";

export const registerServiceNest = (user) => {
  return https_nest.post(`/api/authentication/register/`, user);
};

export const loginServiceNest = async (user) => {
  const response = await https_nest.post("/api/authentication/login", user);
  return response.data;
};

export const listUserService = async () => {
  const response = await https_nest.get("/api/user");
  return response.data;
};
