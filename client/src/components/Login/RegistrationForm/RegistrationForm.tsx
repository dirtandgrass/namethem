import "./RegistrationForm.css";
import localFetch, { HttpMethod } from "../../../utility/LocalFetch";
import { User } from "../../../types/User";

function RegistrationForm() {
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(formEl).entries()) as {
      username: string;
      email: string;
      password: string;
    };

    const result = (await localFetch({
      path: "user/",
      method: HttpMethod.POST,
      data,
    })) as {
      message: string;
      success: boolean;
      user?: User;
    };

    if (result.success) {
    } else {
    }
  }

  return (
    <dialog id="registration-form">
      <form onSubmit={handleRegister}>
        <div className="form_input">
          <input
            name="register_email"
            type="text"
            autoComplete="email"
            placeholder="email"
          />
        </div>
        <div className="form_input">
          <input
            name="register_password"
            autoComplete="new-password"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="form_input">
          <input
            name="register_username"
            type="string"
            placeholder="username"
          />
        </div>
        <div className="form_actions">
          <button type="submit">Register</button>
        </div>
      </form>
    </dialog>
  );
}
export default RegistrationForm;
