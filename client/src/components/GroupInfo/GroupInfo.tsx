import React, { useState, useEffect } from "react";
import localFetch from "../../utility/LocalFetch";
import { User } from "../../types/User";

export type GroupMembershipType = {
  group_id: number;
  role: string;
  description: string;
  name: string;
};

export default function GroupInfo({
  user,
  group,
  setGroup,
}: {
  user: User | undefined | null;
  group: GroupMembershipType | undefined | null;
  setGroup: React.Dispatch<React.SetStateAction<GroupMembershipType | null>>;
}) {
  const [groups, setGroups] = useState<GroupMembershipType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.isLoggedIn || !user?.isLoggedIn()) return;
      setLoading(true);
      try {
        const response = await localFetch({
          path: "group/",
          user: user || undefined,
        });

        const data = response as any;

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
        console.error(error);
      }

      setLoading(false);
    };

    fetchData(); // Call the fetch function when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (groups.length > 0 && group) {
      setGroup(groups.find((g) => g.group_id === group.group_id) || groups[0]);
    }
  }, [groups, group, setGroup]);

  function selectedGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedGroup = groups.find(
      (g) => g.group_id + "" === e.target.value
    );
    if (selectedGroup && selectedGroup !== group) {
      setGroup(selectedGroup);
    }
  }

  if (loading) return <div className="group-info">Loading...</div>;

  if (!user?.isLoggedIn || !user?.isLoggedIn()) return <></>;

  return (
    <div className="group-info">
      <div>Village:</div>
      <select
        name="group-select"
        onChange={selectedGroupChange}
        value={group?.group_id}
      >
        {groups.map((g) => {
          return (
            <option key={g.group_id} value={g.group_id}>
              {g.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
