import { useState } from "react";
import "./App.css";
import RandomName from "./components/RandomName/RandomName";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User } from "./types/User";
import useStorage from "./hooks/useStorage";

function App() {
  const [user, setUser] = useStorage<User>("user", null, "local");

  return (
    <>
      <header className="App-header">
        <Menu />
        <Login user={user} setUser={setUser} />
      </header>
      <main>
        <RandomName user={user} />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
