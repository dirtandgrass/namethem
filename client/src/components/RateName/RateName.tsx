import React, { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";
import { User } from "../../types/User";
import { GroupMembershipType } from "../GroupInfo/GroupInfo";
import localFetch from "../../utility/LocalFetch";

function RateName({
  user,
  group,
}: {
  user: User | undefined | null;
  group: GroupMembershipType | undefined | null;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<NameType>();

  const fetchData = async () => {
    if (group?.group_id === undefined || user?.user_id === undefined) return;
    setLoading(true);
    try {
      const response: any = await localFetch({
        path: `name/unrated/?group_id=${group.group_id}`,
        user: user,
      });

      const data = (response.data as NameType) || undefined;
      //console.log(data);
      setName(data); // Set the fetched data in the state
    } catch (error: unknown) {
      console.error(error);
      //setError({ message: tError.message, name: tError.name }); // Set error state if something goes wrong
    } finally {
      setLoading(false); // Set loading state to false once the fetch is done
    }
  };

  useEffect(() => {
    // Function to fetch data from the API
    fetchData(); // Call the fetch function when the component mounts
  }, [group, user]);

  if (!user) {
    return <></>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!name) {
    return <div>No names to rate</div>;
  }

  return (
    <div>
      <div>{name.name}</div>
      <div>
        <button
          onClick={() => {
            fetchData();
          }}
        >
          Another
        </button>
      </div>
    </div>
  );
}

export default RateName;
