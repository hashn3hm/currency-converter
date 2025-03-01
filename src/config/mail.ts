import { MAIL_HOST, MAIL_PASSWORD, MAIL_USERNAME } from "../constants/environment";

export const mailConfig = {
  pool: true,
  port: 465,
  secure: true,
  host: MAIL_HOST,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
};
