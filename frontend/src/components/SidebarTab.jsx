export const SidebarTab = ({ title, children, active, setActive }) => {
  const isActive = active.toLowerCase() === title.toLowerCase();

  return (
    <div
      onClick={() => setActive(title)}
      className={`flex items-center ${
        isActive ? "bg-gray-300 text-black" : "bg-white text-gray-600"
      } cursor-pointer rounded hover:bg-gray-200 p-2 w-full space-x-4 justify-start`}
    >
      {children}
      <h1
        className={`${
          isActive ? "text-gray-800 font-bold" : "text-gray-600"
        } text-sm`}
      >
        {title}
      </h1>
    </div>
  );
};
