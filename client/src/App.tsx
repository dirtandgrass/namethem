import "./App.css";
import RandomNameList from "./components/RandomNameList/RandomNameList";
import Menu from "./components/Menu/Menu";

import Login from "./components/Login/Login";
import { User } from "./types/User";
import useStorage from "./hooks/useStorage";
import Logo from "./components/Logo/Logo";
import RegistrationForm from "./components/Login/RegistrationForm/RegistrationForm";
import GroupInfo, {
  GroupMembershipType,
} from "./components/GroupInfo/GroupInfo";
import RateName from "./components/RateName/RateName";

function App() {
  const [user, setUser] = useStorage<User>("user", null, "local");
  const [group, setGroup] = useStorage<GroupMembershipType>(
    "group",
    null,
    "local"
  );

  const nameTool =
    !user?.isLoggedIn || !user?.isLoggedIn() ? (
      <RandomNameList user={user} />
    ) : (
      <RateName user={user} group={group} />
    );

  return (
    <>
      <header className="App-header">
        <Logo />

        <div className="login">
          <Login user={user} setUser={setUser} />
          <GroupInfo user={user} group={group} setGroup={setGroup} />
        </div>
        <Menu />
      </header>
      <main>{nameTool}</main>
      <RegistrationForm />
      <footer></footer>
    </>
  );
}

export default App;
