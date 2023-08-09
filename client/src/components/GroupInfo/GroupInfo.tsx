import React, { useState, useEffect } from "react";
import localFetch from "../../utility/LocalFetch";
import { User } from "../../types/User";
import "./GroupInfo.css";

export type GroupMembershipType = {
  group_id: number;
  role: string;
  description: string;
  name: string;
};

export default function GroupInfo({ user }: { user: User | undefined | null }) {
  const [groups, setGroups] = useState<GroupMembershipType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; name: string } | null>(
    null
  );

  useEffect(() => {
    if (!user?.isLoggedIn || !user?.isLoggedIn()) return;
    setLoading(true);
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await localFetch({
          path: "group/",
          user: user || undefined,
        });

        const data = response as any;
        console.log(data);

        if (data?.data && Array.isArray(data.data)) {
          const rData: GroupMembershipType[] = data.data.map((r: any) => {
            return {
              group_id: r.group_id,
              role: r.role,
              name: r.group?.name,
              description: r.group?.description,
            };
          });

          setGroups(rData); // Set the fetched data in the state
        }
      } catch (error: unknown) {
        const tError = (error as Error) || {
          message: "Unknown error",
          name: "Unknown error",
        };
        setError({ message: tError.message, name: tError.name }); // Set error state if something goes wrong
      } finally {
        setLoading(false); // Set loading state to false once the fetch is done
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (user?.isLoggedIn && user?.isLoggedIn()) {
    return (
      <div className="group-info">
        {groups.map((g) => {
          return (
            <div key={g.group_id} className="group-info-group-name">
              {g.name}
            </div>
          );
        })}
      </div>
    );
  }

  return <div className="group-info"></div>;
}
