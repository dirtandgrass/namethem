import { createContext, useContext } from "react";
import "./App.css";
import RandomName from "./components/RandomName/RandomName";
import Menu from "./components/Menu/Menu";

import { LoginStatus, User } from "./components/Login/types";
import { log } from "console";

const loginStatus = new LoginStatus();

export const AuthContext = createContext(loginStatus);

function App() {
  return (
    <>
      <header className="App-header">
        <AuthContext.Provider value={loginStatus}>
          <Menu />
        </AuthContext.Provider>
      </header>
      <main>
        <RandomName />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
