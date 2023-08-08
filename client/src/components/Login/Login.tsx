import { User } from "../../types/User";
import "./Login.css";

import { useEffect } from "react";
import LoginForm from "./LoginForm/LoginForm";

function Login({
  user,
  setUser,
}: {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
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

  let registrationForm = document.getElementById(
    "registration-form"
  ) as HTMLDialogElement;

  function logOut() {
    setUser(null);
  }

  function showRegister() {
    console.log(registrationForm);
    if (!registrationForm) {
      registrationForm = document.getElementById(
        "registration-form"
      ) as HTMLDialogElement;
    }
    registrationForm?.showModal();
  }

  if (user?.isLoggedIn && user?.isLoggedIn()) {
    return (
      <aside className="Login">
        <button onClick={logOut}>Log Out</button>
      </aside>
    );
  } else {
    let form: JSX.Element;

    form = <LoginForm setUser={setUser} />;

    return (
      <div className="Login">
        <div>{form}</div>
        <div>
          <button onClick={showRegister}>Register</button>
        </div>
      </div>
    );
  }
}
export default Login;
