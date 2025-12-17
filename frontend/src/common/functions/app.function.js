import { CLOUNDINARY_IMAGE_URL } from "../url/url.common";

const checkAvatar = (avatar) => {
  if (avatar === null) return "null";
  const avatarUser = `${avatar}`;
  console.log(avatarUser);
  if (
    avatarUser[0] == "h" &&
    avatarUser[1] == "t" &&
    avatarUser[2] == "t" &&
    avatarUser[3] == "p"
  ) {
    return "google";
  }
  return "cloud";
};

export const getAvatarUrl = (avatar) => {
  if (checkAvatar(avatar) == "cloud")
    return `${CLOUNDINARY_IMAGE_URL}/${avatar}`; // true <==> cloud
  else if (checkAvatar(avatar) == "google") return avatar; // false <==> google
  else if (checkAvatar(avatar) === "null")
    return "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg";
};
