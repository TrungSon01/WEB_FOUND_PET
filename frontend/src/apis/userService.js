import axios from "axios";
import { https } from "./config";

export const loginService = async ({ email, password }) => {
  try {
    const response = await https.get(`/api/users/`);
    console.log("response", response);
    const users = response.data;

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      console.log("foundUser", foundUser);
      return foundUser;
    } else {
      throw new Error("User not found or incorrect password");
    }
  } catch (error) {
    console.error("Error while logging in: ", error);
    throw error;
  }
};

export const registerService = (user) => {
  return https.post(`/api/users/`, user);
};

export const getUserById = (user_id) => {
  return https.get(`/api/users/${user_id}`);
};

// Optional: lấy usersMap trực tiếp
export const getUsersMap = async () => {
  const users = await getUsers();
  const map = {};
  users.forEach((u) => {
    map[u.user_id] = u;
  });
  return map;
};
