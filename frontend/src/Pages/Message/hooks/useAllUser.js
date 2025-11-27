import { useState, useEffect } from "react";

export function useAllUsers(currentUserId) {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/user`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const filteredUsers = data.filter(
          (user) => user.user_id !== currentUserId
        );
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách users:", error);
      }
    };

    if (currentUserId) fetchUsers();
  }, [currentUserId]);

  return allUsers;
}
