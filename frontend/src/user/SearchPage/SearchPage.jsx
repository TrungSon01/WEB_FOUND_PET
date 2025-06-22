// src/components/SearchPage/SearchPage.jsx
import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  position: fixed;
  top: 0;
  left: 80px; /* Width of the Navbar */
  height: 100vh;
  width: 370px;
  background-color: white;
  border-right: 1px solid #ddd;
  padding: 20px;
  transform: translateX(${(props) => (props.show ? "0" : "-100%")});
  transition: transform 0.5s ease-in-out;
  z-index: 5;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export default function SearchPage({ show, query, onChange, onSubmit }) {
  return (
    <SearchContainer show={show}>
      <h4>Tìm kiếm bài đăng</h4>
      <form onSubmit={onSubmit}>
        <SearchInput
          type="text"
          placeholder="Tìm theo mô tả..."
          value={query}
          onChange={onChange}
        />
      </form>
    </SearchContainer>
  );
}
