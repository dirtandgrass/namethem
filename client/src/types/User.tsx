export class User {
  user_id = -1;
  username = "";
  email = "";

  setUser(user: User) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.email = user.email;
  }
  getUser() {
    return this;
  }
  isLoggedIn() {
    return this.user_id > 0;
  }
  logOut() {
    this.user_id = -1;
    this.username = "";
    this.email = "";
  }

  constructor(user_id: number, username: string, email: string) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
  }
}
