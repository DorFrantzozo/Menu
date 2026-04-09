"use client";

import * as React from "react";
import { getAllUsers } from "@/utils/fetchData";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DropDown from "./DefaultDropDown";

import { updatePaidStatus } from "@/utils/updateData";
import { useDispatch } from "react-redux";
import { updateUser } from "@/state/user/userSlice";

export default function DataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const handleStatusChange = async (userId, newStatus) => {
    try {
   
      // Update local state immediately for better UX
      const updatedData = data.map((user) => {
        if (user._id === userId) {
          return {
            ...user,
            isPaid: newStatus === "Paid" ? true : false,
          };
        }
        return user;
      });
      setData(updatedData);

      // Use the updatePaidStatus function
      const response = await updatePaidStatus(
        userId,
        newStatus === "Paid" ? true : false
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert the local state if the API call fails
      setData(data);
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-white"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "restaurantName",
      header: "Restaurant Name",
      cell: ({ row }) => <div>{row.getValue("restaurantName")}</div>,
    },
    {
      accessorKey: "isPaid",
      header: "Status",
      cell: ({ row }) => {
        const isPaid = row.getValue("isPaid");
        const userId = row.original._id;

        return (
          <div className="flex overflow-x-auto gap-2">
            <div
              className={`px-2 py-1 rounded-md text-white text-center ${
                isPaid ? "bg-green-500" : "bg-red-200"
              }`}
            >
              {isPaid ? " Paid ✅ " : " Unpaid ❌"}
            </div>
            <Button className="bg-transparent shadow-none hover:bg-transparent ">
              <DropDown
                dropDownTitle="Change Status"
                dropDownItems={["Paid", "Not Paid"]}
                bgColor="bg-black"
                textColor="text-white"
                hoverColor="hover:bg-zinc-700"
                handelSelectedProp={(newStatus) =>
                  handleStatusChange(userId, newStatus)
                }
              />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "_id",
      header: "User Id",
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "trialExpiresAt",
      header: "Free Trial Ends",

      cell: ({ row }) => (
        <div>{row.getValue("trialExpiresAt").split("T")[0]}</div>
      ),
    },
    {
      accessorKey: "designNumber",
      header: "Design Number",
      cell: ({ row }) => <div>{row.getValue("designNumber")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>
      ),
    },
  ];

  React.useEffect(() => {
    getAllUsers().then((users) => setData(users));
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className=" mt-10 bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm text-white focus:bg-zinc-700 transition duration-500 ease-in-out focus:border-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-zinc-800 text-white hover:bg-zinc-500 hover:text-white"
            >
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-white  bg-zinc-800 "
                    key={header.id}
                  >
                    {typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header({ table: table })
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="text-white" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell(cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-white"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
