import React, { useState, useEffect } from "react";
import localFetch from "../../utility/LocalFetch";
import { User } from "../../types/User";
import Name from "../Name/Name";
import "./RandomName.css";

export type NameType = {
  name_id: number;
  name: string;
  male: boolean;
  female: boolean;
};

type NameResult = {
  count: number;
  data: NameType[];
  length: number;
};

function RandomName({ user }: { user: User | undefined | null }) {
  const [data, setData] = useState<NameResult>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; name: string } | null>(
    null
  );

  const [names, setNames] = useState<NameType[]>([]);

  useEffect(() => {
    setLoading(true);
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await localFetch({
          path: "name/?count=10",
          user: user || undefined,
        });

        const data = response as NameResult;
        //console.log(data);
        setData(data); // Set the fetched data in the state
        setNames(data.data);
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

  // Display the appropriate content based on loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render the fetched data
  return (
    <div className="random-name">
      <h1>Here are {data?.count} names for you:</h1>
      <ul>
        {names.map((item, i) => (
          <Name
            names={names}
            setNames={setNames}
            name_index={i}
            user={user}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default RandomName;
