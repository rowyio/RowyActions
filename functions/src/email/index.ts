

/**
 * SendGrid Email integration
 *
 */


/**
 * specify the url of your firetable web app bellow
 * eg demo.firetable.cloud or myfiretable.web.app
 */
const firetableUrl = "demo.firetable.cloud";

/**
  * Before sending emails through sendGrid you'll need to authorize sendGrid to send emails with your domain
  * Specify the authorized domain you would like to use below
  */
const sendGridAuthorizedDomain = "firetable.cloud";


import * as functions from "firebase-functions";
import {htmlTemplate} from "./inviteTemplateEmail";

const sgMail = require("@sendgrid/mail");

/**
 * Sendgrid requires an api key to be used you can signup to Sendgrid and set api key using firebase cli
 * $ firebase functions:config:set send_grid.key="SG API KEY"
 **/
const env = functions.config();

sgMail.setApiKey(env.send_grid.key);

export const sendInviteEmail = async (firstName:string, email:string)=>{
  const dynamicFields :any = {firstName, email, buttonLink: `https://${firetableUrl}/auth`};
  const html = Object.keys(dynamicFields).reduce((acc, currKey)=>{
    return acc.replace(`{{${currKey}}}`, dynamicFields[currKey]);
  }, htmlTemplate);
  const msg = {"to": email,
    "from": `welcome@${sendGridAuthorizedDomain}`,
    "subject": "Firetable Account Invite",
    html,

  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(JSON.stringify(error.response.body));
      throw Error(JSON.stringify(error.response.body));
    }
  }
};
