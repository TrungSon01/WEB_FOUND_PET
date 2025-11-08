// src/pages/SavedPosts/SavedPostsPage.styles.js
import styled from "styled-components";

export const SavedPostsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: thin;

  /* Scrollbar style (Firefox & Chrome) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

export const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
export const PostWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 10%;
    width: 80%;
    height: 1px;
    background-color: #e0e0e0;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
`;
