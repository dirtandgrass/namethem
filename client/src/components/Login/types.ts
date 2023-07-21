export type User = {
  user_id: number;
  username: string;
  email: string;
};

export class LoginStatus {

  isLogin: boolean;
  user: User | null;

  constructor() {
    this.isLogin = false;
    this.user = null;
  }
};
