import localFetch, { HttpMethod } from "../../utility/LocalFetch";
import { User } from "../../types/User";
import "./Login.css";
import useStorage from "../../hooks/useStorage";
import { useEffect } from "react";

function Login({ user }: { user: User | null }) {
  const [userObj, setUser] = useStorage<User>("user", null, "local"); // store logged in user, drilled down from App.tsx

  useEffect(() => {
    if (!userObj) {
      logOut();
      return;
    }
    // storage only stores data members, recreate User object if needed
    if (!userObj.isLoggedIn) {
      setUser(
        new User(
          userObj.user_id,
          userObj.username,
          userObj.email,
          userObj.session_id,
          userObj.session
        )
      );
    }
  });

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(formEl).entries()) as {
      username: string;
      password: string;
    };

    const result = (await localFetch({
      path: "user/login/",
      method: HttpMethod.POST,
      data,
    })) as {
      message: string;
      success: boolean;
      user?: User;
      session?: {
        message: string;
        success: boolean;
        session_id?: number;
        session?: string;
      };
    };

    if (result.success && result.user && result.session?.success) {
      setUser(
        new User(
          result.user.user_id,
          result.user.username,
          result.user.email,
          result.session.session_id,
          result.session.session
        )
      );
    } else {
      logOut();
    }
  }

  function logOut() {
    setUser(null);
  }

  if (userObj?.isLoggedIn && userObj?.isLoggedIn()) {
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
