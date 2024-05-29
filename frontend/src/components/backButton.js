"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back(); // This method navigates back to the previous page
  };

  return (
    <svg
      onClick={goBack}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="3" // Increased stroke width for a thicker line
      stroke="currentColor"
      className="w-8 h-8 cursor-pointer text-blue-500 hover:text-blue-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
};

export default BackButton;
