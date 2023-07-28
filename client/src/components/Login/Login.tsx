import localFetch, { HttpMethod } from "../../utility/LocalFetch";
import { User } from "../../types/User";
import "./Login.css";
import useStorage from "../../hooks/useStorage";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm/LoginForm";
import RegistrationForm from "./RegistrationForm/RegistrationForm";

function Login({
  user,
  setUser,
}: {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      logOut();
      return;
    }
    // storage only stores data members, recreate User object if needed
    if (!user.isLoggedIn) {
      setUser(
        new User(
          user.user_id,
          user.username,
          user.email,
          user.session_id,
          user.session
        )
      );
    }
  });

  function logOut() {
    setUser(null);
  }

  if (user?.isLoggedIn && user?.isLoggedIn()) {
    return (
      <aside className="Login">
        <button onClick={logOut}>Log Out</button>
      </aside>
    );
  } else {
    let form: JSX.Element;

    if (isRegister) {
      form = <RegistrationForm />;
    } else {
      form = <LoginForm setUser={setUser} />;
    }

    return (
      <aside className="Login">
        <h2>{isRegister ? "Sign Up!" : "Log In"}</h2>

        {form}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? "Cancel" : "Register New User"}
        </button>
      </aside>
    );
  }
}
export default Login;
