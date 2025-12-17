import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPosts, timeAgo } from "../../../apis/postFormService"; // Adjust path as needed

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const [listPost, setListPost] = useState([]);
  const { posts } = useSelector((state) => state.postSlice);

  useEffect(() => {
    if (posts.length > 0) return;
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setListPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  // Auto focus input when mounted
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Update query from URL params and perform search
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, posts]);

  // Handle escape key to go back
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [navigate]);

  // Hàm tìm kiếm trong Redux data
  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const queryLower = searchQuery.toLowerCase().trim();

      // Lọc posts theo description
      const sourcePosts = Array.isArray(posts)
        ? posts
        : Array.isArray(listPost)
        ? listPost
        : [];

      const filteredResults = sourcePosts.filter((post) => {
        const description = post.description?.toLowerCase() || "";
        return description.includes(queryLower);
      });

      // Sắp xếp kết quả theo thời gian mới nhất
      const sortedResults = filteredResults.sort((a, b) => {
        return new Date(b.post_time) - new Date(a.post_time);
      });

      setResults(sortedResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear debounce timer cũ
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Real-time search với debounce
    if (newQuery.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newQuery);
      }, 300); // Giảm xuống 300ms vì search local nhanh hơn
    } else if (newQuery.trim().length === 0) {
      setResults([]);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearchParams({});
    setIsLoading(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    searchInputRef.current?.focus();
  };
  const handleResultClick = (postId) => {
    navigate("/", { state: { openPostId: postId } });
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Quay lại"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm theo mô tả bài đăng..."
                  value={query}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search hint */}
          {query.trim().length > 0 && query.trim().length < 2 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Nhập ít nhất 2 ký tự để tìm kiếm
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Empty State - No Query */}
        {!query && !isLoading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Tìm kiếm bài đăng
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Nhập từ khóa để tìm kiếm trong mô tả bài đăng
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-400">Ví dụ:</span>
              <button
                onClick={() => setQuery("con")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                con
              </button>
              <button
                onClick={() => setQuery("đây")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                đây
              </button>
              <button
                onClick={() => setQuery("gì")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                gì
              </button>
            </div>
          </div>
        )}

        {/* Empty State - No Results */}
        {query &&
          query.trim().length >= 2 &&
          !isLoading &&
          results.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Không tìm thấy kết quả
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Không có bài đăng nào có mô tả chứa "<strong>{query}</strong>"
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Tìm thấy <strong>{results.length}</strong> kết quả cho "
              <strong>{query}</strong>"
            </p>

            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.post_id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-indigo-300"
                  onClick={() => handleResultClick(result.post_id)}
                >
                  <div className="flex gap-4">
                    {/* Hình ảnh */}
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.breed || "Pet image"}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Nội dung */}
                    <div className="flex-1 min-w-0">
                      {/* Loài */}
                      {result.species && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {result.species}
                        </h3>
                      )}

                      {/* Giống */}
                      {result.breed && (
                        <p className="text-sm font-medium text-indigo-600 mb-1">
                          {result.breed}
                        </p>
                      )}

                      {/* Mô tả - Highlight từ khóa tìm kiếm */}
                      {result.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {result.description}
                        </p>
                      )}

                      {/* Trạng thái */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {result.status ? "Đang hoạt động" : "Không hoạt động"}
                        </span>

                        {result.like_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            {result.like_count} lượt thích
                          </span>
                        )}

                        {result.post_time && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {timeAgo(result.post_time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
