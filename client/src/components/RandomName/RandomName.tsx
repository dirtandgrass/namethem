import React, { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
}

const RandomName: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; name: string } | null>(
    null
  );

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Item[] = await response.json();
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
      <h1>Fetched Data:</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RandomName;
