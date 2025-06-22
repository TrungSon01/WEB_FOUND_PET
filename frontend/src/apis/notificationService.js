import { https } from "./config";

export const getNotifications = async (user_id) => {
  try {
    const response = await https.get(`/api/users/${user_id}/notifications/`);
    return response.data;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    throw err;
  }
};
