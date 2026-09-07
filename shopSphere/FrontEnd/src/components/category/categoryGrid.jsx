import CategoryCard from "./categoryCard";

const CategoryGrid = ({ categories = [] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;