import DataTable from "../components/data/DataTable";
import { UsersCountCard } from "@/components/Cards/UsersCountCard";
const AdminPage = () => {
  return (
    <div className="h-screen flex justify-center ">
      <div className=" w-[80%]">
        <h1 className="text-center mt-20 text-3xl mb-10">Users</h1>
        <div className="flex  gap-4">
          <UsersCountCard />
        </div>
        <DataTable />
      </div>
    </div>
  );
};

export default AdminPage;
