import "./App.css";
import RandomName from "./components/RandomName/RandomName";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User } from "./types/User";
import useStorage from "./hooks/useStorage";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import GroupInfo from "./components/GroupInfo/GroupInfo";

function App() {
  const [user, setUser] = useStorage<User>("user", null, "local");

  return (
    <>
      <header className="App-header">
        <Logo />
        <Menu />

        <Login user={user} setUser={setUser} />
        <GroupInfo user={user} />
      </header>
      <main>
        <RandomName user={user} />
      </main>
      <RegistrationForm />
      <footer></footer>
    </>
  );
}

export default App;
