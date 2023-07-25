import localFetch, { HttpMethod } from "../../utility/LocalFetch";
import { User } from "../../types/User";
import { useState } from "react";
import "./Login.css";

function Login({ user }: { user: User }) {
  const [userObj, setUser] = useState(user);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(formEl).entries()) as {
      username: string;
      password: string;
    };

    const result = (await localFetch("user/login/", HttpMethod.POST, data)) as {
      message: string;
      success: boolean;
      user?: User;
    };

    if (result.success && result.user) {
      setUser(
        new User(result.user.user_id, result.user.username, result.user.email)
      );
    }
  }

  function logOut() {
    setUser(new User(-1, "", ""));
  }

  if (userObj.isLoggedIn()) {
    return <button onClick={logOut}>Log Out</button>;
  } else {
    return (
      <aside className="Login">
        <form onSubmit={handleLogin}>
          <div className="form_input">
            <input
              name="login_email"
              type="text"
              autoComplete="email"
              placeholder="email"
            />
          </div>
          <div className="form_input">
            <input
              name="login_password"
              autoComplete="current-password"
              type="password"
              placeholder="password"
            />
          </div>
          <div className="form_input">
            <label htmlFor="create_session">Keep me logged in</label>
            <input
              name="create_session"
              type="checkbox"
              value="true"
              defaultChecked
            />
          </div>
          <div className="form_actions">
            <button type="submit">Log In</button>
          </div>
        </form>
      </aside>
    );
  }
}
export default Login;
