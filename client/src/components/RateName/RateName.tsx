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
  const displaySettings = {
    class: "rate-name",
    genderText: "",
  };
  if (loading) {
    return <div className={displaySettings.class}>Loading...</div>;
  }

  if (!name) {
    return <div>No names to rate</div>;
  }

  if (name.female && name.male) {
    displaySettings.class += " unisex";
    displaySettings.genderText = "Unisex";
  } else if (name.female) {
    displaySettings.class += " girl";
    displaySettings.genderText = "Girl";
  } else if (name.male) {
    displaySettings.class += " boy";
    displaySettings.genderText = "Boy";
  }

  return (
    <div className={displaySettings.class}>
      <div className="name-card">
        <div className="name">{name.name}</div>
        <div>
          <div>
            <strong>Sex</strong> <em>{displaySettings.genderText}</em>
          </div>
          <div>
            <strong>Sources</strong>
            <NameSource name={name} />
          </div>
        </div>
      </div>
      <div className="name-controls">
        <button>No</button>
        <button>Ugh</button>
        <button
          onClick={() => {
            fetchName();
          }}
        >
          Skip
        </button>
        <button>Like</button>
        <button>Love</button>
      </div>
    </div>
  );
}

export default RateName;
