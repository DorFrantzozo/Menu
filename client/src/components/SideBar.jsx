const SideBar = (categories) => {
  // Destructure categories here
  return (
    <div className="text-white text-center p-3 w-[250px] bg-gray-500 h-[full]">
      Menu
      <div>
        {categories &&
          categories.map((category) => (
            <h1 key={category._id}>{category.name}</h1>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
