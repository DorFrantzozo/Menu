import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CountUp from "../TextAnimations/CountUp/CountUp";
import { getAllUsers } from "../../utils/fetchData";
export function UsersCountCard() {
  const [userCount, setUserCount] = useState(0); // נשתמש ב-state כדי לעדכן את מספר המשתמשים

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserCount(users.length); // עדכון ה-state עם מספר המשתמשים
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card className="w-[220px] bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle className="text-white">Users</CardTitle>
        <CardDescription className="text-white">
          Current Subscribed users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountUp
          from={0}
          to={userCount}
          delay={0}
          duration={1}
          className="text-4xl text-green-500 flex justify-center"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button className="text-black" variant="outline">
          Cancel
        </Button>
        <Button>Deploy</Button> */}
      </CardFooter>
    </Card>
  );
}
