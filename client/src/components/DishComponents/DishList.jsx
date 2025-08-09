import DishCard from "./DishCard";

export default function DishList({ dishes,user }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dishes.length > 0 ? (
        dishes.map(dish => <DishCard key={dish._id} user={user} dish={dish} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">לא נמצאו מנות התואמות לסינון</p>
      )}
    </div>
  );
}
