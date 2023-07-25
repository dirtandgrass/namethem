import { useState } from "react";
import "./App.css";
import RandomName from "./components/RandomName/RandomName";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User } from "./types/User";

function App() {
  const [user] = useState<User>(new User(-1, "", ""));

  return (
    <>
      <header className="App-header">
        <Menu />
        <Login user={user} />
      </header>
      <main>
        <RandomName />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
