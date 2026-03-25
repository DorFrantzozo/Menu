import AdminUsersTable from "../components/admin/AdminUsersTable";
import { UsersCountCard } from "@/components/Cards/UsersCountCard";
const AdminPage = () => {
  return (
    <div className="flex justify-center mb-2 w-full overflow-x-hidden">
      <div className="w-full max-w-[95%] md:w-[90%]">
        <h1 className="text-center mt-20 text-3xl mb-10">Users</h1>
        <div className="flex flex-wrap gap-4">
          <UsersCountCard />
        </div>
        <div className="">
          <AdminUsersTable />
        </div>
        {/* <div className="mt-2">
          <VercelAnalytics />
        </div> */}
      </div>
    </div>
  );
};

export default AdminPage;
