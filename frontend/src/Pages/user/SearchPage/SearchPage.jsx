import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage({
  show,
  query,
  onChange,
  onSubmit,
  onClose,
}) {
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (show && onClose) {
      onClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (show && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && show && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-all duration-300 z-[4] ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-20 h-screen w-[370px] bg-white border-r border-gray-200 p-5 transition-transform duration-500 ease-in-out z-[5] ${
          show ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-lg font-semibold text-gray-800 m-0">
            Tìm kiếm bài đăng
          </h4>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl text-gray-600 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 hover:text-black"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm theo mô tả, tên thú cưng..."
            value={query}
            onChange={onChange}
            className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </form>

        {query && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Đang tìm kiếm: <strong>{query}</strong>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
