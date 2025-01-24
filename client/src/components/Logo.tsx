import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const handleButtonClick = (): void => {
    navigate("/");
  };

  return (
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={handleButtonClick}
    >
      <span className="relative w-14 h-14 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center group">
        <span className="absolute inset-0 bg-yellow-200/30 rounded-full blur-md group-hover:opacity-50 transition-opacity duration-300"></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-8 h-8 z-10 group-hover:scale-110 transition-transform duration-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1v22M8 6h8a4 4 0 010 8H8a4 4 0 010-8z"
          />
        </svg>
      </span>
      <span className="text-gray-50 hover:text-yellow-300 transition-all duration-300">
        Finac
      </span>
    </div>
  );
};

export default Logo;
