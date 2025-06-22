import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Input({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      <span
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}
