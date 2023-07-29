import React, { useState, useEffect } from "react";
import localFetch from "../../utility/LocalFetch";
import { Name as NameType } from "../RandomName/RandomName";
import { User } from "../../types/User";

function Name({
  names,
  setNames,
  name_index,
  user,
}: {
  names: NameType[];
  setNames: React.Dispatch<React.SetStateAction<NameType[]>>;
  name_index: number;
  user: User | undefined | null;
}) {
  const name = names[name_index];

  if (!user) {
    return <div>{name.name}</div>;
  }

  return (
    <div>
      <div>{name.name}</div>
    </div>
  );
}

export default Name;