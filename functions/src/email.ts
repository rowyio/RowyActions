// basic email integration
import * as functions from "firebase-functions";
import {htmlTemplate} from "./inviteTemplateEmail";

const sgMail = require("@sendgrid/mail");

/**
 * Sendgrid requires an api key to be used you can signup to Sendgrid and set api key using firebase cli
 * $ firebase functions:config:set send_grid.key="SG API KEY"
 **/
const env = functions.config();


const firetableUrl = `YOUR_FIRETABLE_APP_URL`
sgMail.setApiKey(env.send_grid.key);

export const sendInviteEmail = async (firstName:string, email:string)=>{
  const dynamicFields :any = {firstName, email, buttonLink: `https://${firetableUrl}/auth`};
  const html = Object.keys(dynamicFields).reduce((acc, currKey)=>{
    return acc.replace(`{{${currKey}}}`, dynamicFields[currKey]);
  }, htmlTemplate);
  const msg = {"to": email,
    "from": "welcome@firetable.cloud",
    "subject": "Firetable Invite",
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
