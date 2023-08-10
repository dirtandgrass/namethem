import React, { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";

import localFetch from "../../utility/LocalFetch";
// import "./NameSource.css";

function NameSource({ name }: { name: NameType }) {
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSources = async () => {
    // setLoading(true);
    // try {
    //   const response: any = await localFetch({
    //     path: `name/unrated/?group_id=${group.group_id}`,
    //     user: user,
    //   });
    //   const data = (response.data as NameType) || undefined;
    //   //console.log(data);
    //   setName(data); // Set the fetched data in the state
    // } catch (error: unknown) {
    //   console.error(error);
    //   //setError({ message: tError.message, name: tError.name }); // Set error state if something goes wrong
    // } finally {
    //   setLoading(false); // Set loading state to false once the fetch is done
    // }
  };

  useEffect(() => {
    // Function to fetch data from the API
    fetchSources(); // Call the fetch function when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div className="name-source">sources</div>;
}

export default NameSource;
