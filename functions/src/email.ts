// basic email integration
import * as functions from "firebase-functions";


const fs = require('fs')
const sgMail = require("@sendgrid/mail");

/**
 * Sendgrid requires an api key to be used you can signup to Sendgrid and set api key using firebase cli
 * $ firebase functions:config:set send_grid.key="SG API KEY"
 **/
const env = functions.config()
sgMail.setApiKey(env.send_grid.key);
// specify templating format
sgMail.setSubstitutionWrappers("{{", "}}");

export const sendEmail = sgMail.send

export const sendInviteEmail = (firstName:string, email:string)=>{
    const htmlTemplate = fs.readFileSync('./inviteTemplateEmail.html')
   return sendEmail(
        {   "to": "test@example.com",
            "from": "test@example.com",
            "subject": "Firetable Invite",
            "html": htmlTemplate,
          }
    )
   
}