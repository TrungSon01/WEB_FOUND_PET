import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaPlus, FaBookmark } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import styled from "styled-components";
import { useNavigate } from "react-router";
import UserMenu from "../UserMenu/UserMenu";
import Notification from "../Notification/Notification";
import SearchPage from "../../Pages/user/SearchPage/SearchPage"; // Import component đã tách

const NavbarContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 80px;
  background-color: #ffffff;
  border-right: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  z-index: 10;
`;

const IconButton = styled.div`
  margin: 20px 0;
  font-size: 24px;
  color: #000;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;

  &:hover {
    color: #555;
  }
`;

const TopSection = styled.div``;
const CenterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  margin-top: 1px;
`;

const Navbar = ({ onCreatePost, onNotificationPostClick, onSearch }) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setShowSearch(false);
  };

  return (
    <>
      <NavbarContainer>
        <TopSection>
          <UserMenu />
        </TopSection>

        <CenterSection>
          <IconButton onClick={() => navigate("/")}>
            <FaHouseChimney />
          </IconButton>
          <IconButton onClick={handleSearchClick}>
            <FaSearch />
          </IconButton>
          <IconButton>
            <FaMapMarkerAlt />
          </IconButton>
          <IconButton onClick={() => navigate("/create-post")}>
            <FaPlus />
          </IconButton>
          <IconButton>
            <Notification onNotificationClick={onNotificationPostClick} />
          </IconButton>
          <IconButton onClick={() => navigate("/saved-posts")}>
            <FaBookmark />
          </IconButton>
        </CenterSection>
      </NavbarContainer>

      {/* Component đã tách */}
      <SearchPage
        show={showSearch}
        query={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSubmit={handleSearchSubmit}
      />
    </>
  );
};

export default Navbar;
