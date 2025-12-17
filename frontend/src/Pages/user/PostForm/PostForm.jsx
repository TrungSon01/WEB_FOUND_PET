import React, { useState, useEffect } from "react";
import MapPicker from "./MapPicker";
import "./PostForm.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/loadingSlice";
import imageCompression from "browser-image-compression";
import { createPost } from "../../../apis/postFormService";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaImage, FaSearch, FaPaw } from "react-icons/fa";

function PostForm() {
  const [locationOption, setLocationOption] = useState("current");
  const [coords, setCoords] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
  const user_id = userAccount.user_id || "";
  const [form, setForm] = useState({
    user_id: user_id,
    status: false,
    species: "",
    breed: "",
    description: "",
    like_count: 0,
  });

  const dispatch = useDispatch();

  const handleAddressSearch = async () => {
    if (!address.trim()) return;
    setIsSearching(true);
    try {
      dispatch(showLoading());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );

      const data = await response.json();
      dispatch(hideLoading());
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setLocationOption("map");
      } else {
        toast.error("Không tìm thấy địa chỉ phù hợp!");
      }
    } catch (err) {
      toast.error("Lỗi khi tìm kiếm địa chỉ!");
    }
    setIsSearching(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => {
        toast.error("Không lấy được vị trí: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (locationOption === "current") {
      getCurrentLocation();
    }
  }, [locationOption]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const renamedFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
          lastModified: Date.now(),
        });

        setImageFile(renamedFile);
        setImagePreview(URL.createObjectURL(renamedFile));
      } catch (error) {
        toast.error("Không thể xử lý ảnh.");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!coords) {
      toast.error("Vui lòng chọn vị trí!");
      return;
    }

    if (!form.species || !form.breed || !imageFile) {
      toast.error("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("species", form.species);
    formData.append("breed", form.breed);
    formData.append("status", form.status);
    formData.append("description", form.description);
    formData.append("latitude", coords.latitude);
    formData.append("longitude", coords.longitude);
    formData.append("image", imageFile);
    formData.append("user_id", form.user_id);
    formData.append("like_count", 0);

    try {
      dispatch(showLoading());
      await createPost(formData);
      toast.success("Đã gửi bài thành công!");
      setForm({
        user_id,
        status: false,
        species: "",
        breed: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setCoords(null);
      setAddress("");
    } catch (err) {
      toast.error("Gửi bài thất bại!");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="post-form-wrapper">
      <div className="post-form-container">
        {/* Header */}
        <div className="post-form-header">
          <FaPaw className="header-icon" />
          <h2 className="post-form-title">Đăng bài tìm thú cưng</h2>
          <p className="post-form-subtitle">
            Chia sẻ thông tin để tìm kiếm hoặc giúp đỡ thú cưng
          </p>
        </div>

        {/* Form Content */}
        <div className="post-form-content">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3 className="section-title">Thông tin thú cưng</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Loài</label>
                <select
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Chọn loài --</option>
                  <option value="Chó">🐕 Chó</option>
                  <option value="Mèo">🐈 Mèo</option>
                  <option value="Hamster">🐹 Hamster</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Đực">♂️ Đực</option>
                  <option value="Cái">♀️ Cái</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea
                name="description"
                placeholder="Mô tả đặc điểm, màu sắc, nơi phát hiện..."
                value={form.description}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>

          {/* Upload ảnh */}
          <div className="form-section">
            <h3 className="section-title">Hình ảnh</h3>
            <div className="upload-area">
              {!imagePreview ? (
                <label className="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  <FaImage className="upload-icon" />
                  <span className="upload-text">Tải ảnh lên</span>
                  <span className="upload-hint">
                    Nhấp để chọn ảnh từ thiết bị
                  </span>
                </label>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vị trí */}
          <div className="form-section">
            <h3 className="section-title">
              <FaMapMarkerAlt className="section-icon" />
              Vị trí
            </h3>

            <div className="location-options">
              <label className="location-option">
                <input
                  type="radio"
                  value="current"
                  checked={locationOption === "current"}
                  onChange={() => setLocationOption("current")}
                  className="location-radio"
                />
                <div className="location-option-content">
                  <span className="location-option-title">Vị trí hiện tại</span>
                  <span className="location-option-desc">
                    Sử dụng GPS của thiết bị
                  </span>
                </div>
              </label>

              <label className="location-option">
                <input
                  type="radio"
                  value="map"
                  checked={locationOption === "map"}
                  onChange={() => setLocationOption("map")}
                  className="location-radio"
                />
                <div className="location-option-content">
                  <span className="location-option-title">
                    Chọn trên bản đồ
                  </span>
                  <span className="location-option-desc">
                    Nhấp vào bản đồ để chọn
                  </span>
                </div>
              </label>
            </div>

            {/* Tìm kiếm địa chỉ */}
            <div className="address-search">
              <input
                type="text"
                placeholder="Nhập địa chỉ để tìm kiếm..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddressSearch();
                }}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={isSearching || !address.trim()}
                className="search-button"
              >
                <FaSearch />
                {isSearching ? "Đang tìm..." : "Tìm"}
              </button>
            </div>

            {/* Bản đồ */}
            <div className="map-container">
              {coords ? (
                <div className="map-wrapper">
                  <div className="coords-display">
                    <FaMapMarkerAlt />
                    <span>
                      {coords.latitude.toFixed(6)},{" "}
                      {coords.longitude.toFixed(6)}
                    </span>
                  </div>
                  <MapPicker
                    coords={coords}
                    onPick={setCoords}
                    picking={locationOption === "map"}
                  />
                  {locationOption === "map" && (
                    <div className="map-hint">
                      💡 Nhấp vào bản đồ để chọn vị trí chính xác
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-location">
                  <FaMapMarkerAlt className="no-location-icon" />
                  <p>Chưa có vị trí được chọn</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button className="submit-button" onClick={handleSubmit}>
            <FaPaw />
            Đăng bài ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostForm;
