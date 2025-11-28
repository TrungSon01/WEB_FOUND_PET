import { v2 as cloudinary } from 'cloudinary';
import { app_constant } from 'src/common/constant/app.constant';
cloudinary.config({
  cloud_name: app_constant.CLOUNDINARY_NAME,
  api_key: app_constant.CLOUNDINARY_API_KEY,
  api_secret: app_constant.CLOUNDINARY_API_SECRET,
});

export default cloudinary;
