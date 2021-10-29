import crypto from "crypto";

class Services {
  // encrypt = async (password: string) => {
  // 	let cipher = crypto.createCipher("aes-256-ctr",password)
  // 	let crypted = cipher.update(password,'utf8','hex')
  // 	crypted += cipher.final('hex');
  // 	return password;
  // }
  // decrypt = async (password: string) => {
  // 	let decipher = crypto.createDecipher("aes-256-ctr",password)
  // 	let dec = decipher.update(password,'hex','utf8')
  // 	dec += decipher.final('utf8');
  // 	return password;
  // }
}

export const CryptoServices = new Services();
