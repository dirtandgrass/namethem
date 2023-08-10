import React, { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";
import { User } from "../../types/User";
import { GroupMembershipType } from "../GroupInfo/GroupInfo";
import localFetch from "../../utility/LocalFetch";
import "./RateName.css";
import NameSource from "../NameSource/NameSource";

function RateName({
  user,
  group,
}: {
  user: User | undefined | null;
  group: GroupMembershipType | undefined | null;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<NameType>();

  const fetchName = async () => {
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
    fetchName(); // Call the fetch function when the component mounts
  }, []);

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
    <div className="rate-name">
      <div>{name.name}</div>
      {name.female ? <div>Girl</div> : <></>}
      {name.male ? <div>Boy</div> : <></>}
      <NameSource name={name} />
      <div className="controls">
        <button
          onClick={() => {
            fetchName();
          }}
        >
          Another
        </button>
      </div>
    </div>
  );
}

export default RateName;
