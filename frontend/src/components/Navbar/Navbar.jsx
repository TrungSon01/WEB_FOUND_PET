// import React, { useState } from "react";
// import { FaSearch, FaMapMarkerAlt, FaPlus, FaBookmark } from "react-icons/fa";
// import { FaHouseChimney } from "react-icons/fa6";
// import styled from "styled-components";
// import { useNavigate } from "react-router";
// import UserMenu from "../UserMenu/UserMenu";
// import Notification from "../Notification/Notification";
// import SearchPage from "../../Pages/user/SearchPage/SearchPage"; // Import component đã tách

// const NavbarContainer = styled.div`
//   position: fixed;
//   height: 100vh;
//   width: 80px;
//   background-color: #ffffff;
//   border-right: 1px solid #dddddd;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px 0;
//   z-index: 10;
// `;

// const IconButton = styled.div`
//   margin: 20px 0;
//   font-size: 24px;
//   color: #000;
//   cursor: pointer;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 2px;

//   &:hover {
//     color: #555;
//   }
// `;

// const TopSection = styled.div``;
// const CenterSection = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 2px;
//   margin-top: 1px;
// `;

// const Navbar = ({ onCreatePost, onNotificationPostClick, onSearch }) => {
//   const navigate = useNavigate();
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearchClick = () => {
//     setShowSearch(!showSearch);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (onSearch) onSearch(searchQuery);
//     setShowSearch(false);
//   };

//   return (
//     <>
//       <NavbarContainer>
//         <TopSection>
//           <UserMenu />
//         </TopSection>

//         <CenterSection>
//           <IconButton onClick={() => navigate("/")}>
//             <FaHouseChimney />
//           </IconButton>
//           <IconButton onClick={handleSearchClick}>
//             <FaSearch />
//           </IconButton>
//           <IconButton>
//             <FaMapMarkerAlt />
//           </IconButton>
//           <IconButton onClick={() => navigate("/create-post")}>
//             <FaPlus />
//           </IconButton>
//           <IconButton>
//             <Notification onNotificationClick={onNotificationPostClick} />
//           </IconButton>
//           <IconButton onClick={() => navigate("/saved-posts")}>
//             <FaBookmark />
//           </IconButton>
//         </CenterSection>
//       </NavbarContainer>

//       {/* Component đã tách */}
//       <SearchPage
//         show={showSearch}
//         query={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         onSubmit={handleSearchSubmit}
//       />
//     </>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaPlus, FaBookmark } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu";
import Notification from "../Notification/Notification";
import SearchPage from "../../Pages/user/SearchPage/SearchPage";

const Navbar = ({ onCreatePost, onNotificationPostClick, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
    handleSearchClose();
  };

  // Kiểm tra route hiện tại
  const isActive = (path) => location.pathname === path;

  // Danh sách navigation items
  const navItems = [
    {
      id: "home",
      icon: FaHouseChimney,
      label: "Trang chủ",
      onClick: () => navigate("/"),
      path: "/",
    },
    {
      id: "search",
      icon: FaSearch,
      label: "Tìm kiếm",
      onClick: handleSearchToggle,
      active: showSearch,
    },
    {
      id: "map",
      icon: FaMapMarkerAlt,
      label: "Bản đồ",
      onClick: () => navigate("/map"),
      path: "/map",
    },
    {
      id: "create",
      icon: FaPlus,
      label: "Tạo bài viết",
      onClick: () => navigate("/create-post"),
      path: "/create-post",
    },
    {
      id: "saved",
      icon: FaBookmark,
      label: "Đã lưu",
      onClick: () => navigate("/saved-posts"),
      path: "/saved-posts",
    },
  ];

  return (
    <>
      {/* Navbar Container */}
      <nav className="fixed h-screen w-20 bg-white border-r border-gray-200 flex flex-col justify-between items-center py-5 z-10">
        {/* Top Section - User Menu */}
        <div>
          <UserMenu />
        </div>

        {/* Center Section - Navigation Icons */}
        <div className="flex-1 flex flex-col justify-start items-center gap-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.path ? isActive(item.path) : item.active;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`
                  my-5 text-2xl cursor-pointer flex flex-col justify-center items-center gap-0.5
                  transition-all duration-200 p-2 rounded-lg
                  ${
                    active
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }
                `}
                aria-label={item.label}
                title={item.label}
              >
                <Icon />
              </button>
            );
          })}

          {/* Notification - Component riêng */}
          <div className="my-5 text-2xl cursor-pointer flex flex-col justify-center items-center gap-0.5 transition-all duration-200 p-2 rounded-lg hover:bg-gray-50">
            <Notification onNotificationClick={onNotificationPostClick} />
          </div>
        </div>

        {/* Bottom Section - Có thể thêm settings */}
        <div className="mb-2">{/* Để trống hoặc thêm settings button */}</div>
      </nav>

      {/* Search Panel */}
      <SearchPage
        show={showSearch}
        query={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSubmit={handleSearchSubmit}
        onClose={handleSearchClose}
      />
    </>
  );
};

export default Navbar;
