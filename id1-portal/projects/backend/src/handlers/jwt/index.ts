import { EXCEPTION_MESSAGES } from "../../constants";
import { private_key } from "../../config";
import jwt from "jsonwebtoken";
import { Users } from "../../features/users";
import { user_auth } from "../../features/auth";
import { Visitors } from "../../features/visitors";

export async function verifyGeneralToken(token: string): Promise<object> {
  try {
    const verifyData = await verify(
      token,
      user_auth.get_authorization_data_by_general_users_id
    );

    return {
      userId: verifyData.tokenData.userId,
      email: verifyData.user.email,
      role: verifyData.user.role,
      is_active: verifyData.user.is_active,
      exp: verifyData.tokenData.exp,
      iat: verifyData.tokenData.iat,
    };
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
}

export async function verifyVisitorToken(token: string): Promise<object> {
  try {
    const verifyData = await verify(token, Visitors.get_visitor_by_id);

    return {
      userId: verifyData.tokenData.userId,
      email: verifyData.user.email,
      role: verifyData.user.role,
      is_active: verifyData.user.is_active,
      first_name: verifyData.user.first_name,
      last_name: verifyData.user.last_name,
      patronymic: verifyData.user.patronymic,
      phone: verifyData.user.phone,
      birthday: verifyData.user.birthday,
      exp: verifyData.tokenData.exp,
      iat: verifyData.tokenData.iat,
    };
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
}

export async function verifyToken(token: string): Promise<object> {
  try {
    const verifyData = await verify(token, Users.get_user_by_id);

    return {
      userId: verifyData.tokenData.userId,
      email: verifyData.user.email,
      role: verifyData.user.role,
      is_active: verifyData.user.is_active,
      userName: verifyData.user.username,
      exp: verifyData.tokenData.exp,
      iat: verifyData.tokenData.iat,
    };
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
}

async function verify(token: string, getUser: any): Promise<any> {
  const tokenData: any = jwt.verify(token, private_key);

  const user = await getUser({ options: { id: tokenData.userId } });

  if (!user || !user.is_active) {
    let err = new Error(EXCEPTION_MESSAGES.ON_ACCESS_DENIED_EXCEPTION);
    err.statusCode = 401;
    throw err;
  }

  return { tokenData, user };
}
