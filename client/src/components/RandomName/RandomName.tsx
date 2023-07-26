import React, { useState, useEffect } from "react";

type Name = {
  name_id: number;
  name: string;
  male: boolean;
  female: boolean;
};

type NameResult = {
  count: number;
  data: Name[];
  length: number;
};

const RandomName: React.FC = () => {
  const [data, setData] = useState<NameResult>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; name: string } | null>(
    null
  );

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/name?count=2");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: NameResult = await response.json();
        //console.log(data);
        setData(data); // Set the fetched data in the state
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

    // Cleanup function (optional)
    return () => {
      // Perform any cleanup (e.g., canceling pending requests) if needed
    };
  }, []);

  // Display the appropriate content based on loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render the fetched data
  return (
    <div>
      <h1>Here are {data?.count} names for you:</h1>
      <ul>
        {data?.data.map((item) => (
          <li key={item.name_id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RandomName;
