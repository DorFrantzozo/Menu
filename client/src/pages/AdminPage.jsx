import AdminUsersTable from "../components/admin/AdminUsersTable";
import {UsersCountCard} from "@/components/Cards/UsersCountCard";
import UrgentActionsWidget from "../components/admin/UrgentActionsWidget";

const AdminPage = () => {
  return (
    <div className="flex justify-center mb-2 w-full overflow-x-hidden">
      <div className="w-full max-w-[95%] md:w-[90%]">
        <h1 className="text-center mt-20 text-3xl mb-10">Users</h1>
        <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
          <div className="flex-1 min-w-0">
            <UsersCountCard />
          </div>
          <div className="w-full lg:w-1/3 min-w-[300px]">
            <UrgentActionsWidget />
          </div>
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
