export type login_payload = {
  email: string;
  password: string;
  keepSignedIn: boolean;
  typeOfUser: string;
};

export type reset_password_payload = {
  email: string;
  code: string;
  password: string;
  language: string;
  typeOfUser: string;
};

export type change_password_payload = {
  userId: number;
  oldPassword: string;
  newPassword: string;
};

export type confirmation_password = {
  email: string;
  code: string;
  typeOfUser: string;
  language: string;
};

export type update_user_code_password = {
  email: string;
  typeOfUser: string;
  language: string;
};
