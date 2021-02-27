import * as admin from "firebase-admin";
admin.initializeApp();
import callableAction from "firetable-actions";
import {sendInviteEmail} from './email'
const auth = admin.auth()
const db = admin.firestore()


export const SendUserInvite = callableAction(async ({row, callableData}) =>{
  const {action,ref} = callableData;
  const {firstName,lastName,email,roles} =row
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    // create firebase auth user 
    try {
      // fetch user from firebase auth based on the invite email
      const user = await auth.getUserByEmail(email)
      await db.doc(ref.path).update({uid:user.uid})
      // set user's roles
      const updatedClaims = { ...user.customClaims,roles };
      await auth.setCustomUserClaims(user.uid, updatedClaims);    
    }catch (e){
      // if firebase auth user does not exist then create an empty user with
      const uid = 'generate-uid'
      await auth.importUsers([
        {
          uid:uid,
          displayName: `${firstName} ${lastName}`,
          email,
          // set users roles
          customClaims: {roles},
        },
      ])
      await db.doc(ref.path).update({uid})
    }
    case "redo":
      // send/resend invite email 
      sendInviteEmail(firstName,email)
    break;
    case "undo":
    // this case is never reached because 
    default:
      break;
  }

  return {success: true, // return if the operation was success
    message: `An invite was sent to ${row.firstName} on ${row.email}`, // message shown in snackbar on the firetable ui after the completion of action
    cellStatus: "invited", // optional cell label, to indicate the latest state of the cell/row
    newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
  };
});



export const suspendUser = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  const {firstName,uid} = row
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    case "redo":
      // both run and redo preform the same action; disabling the user's account from firebase auth
      auth.updateUser(uid, {disabled:true})
      return {success: true, // return if the operation was success
        message: `${firstName}'s account has been disabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "disabled", // optional cell label, to indicate the latest state of the cell/row
        newState: "undo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    case "undo":
      // re-enable user's firebase account
      auth.updateUser(uid, {disabled:false})
      return {success: true, // return if the operation was success
        message: `${firstName}'s account has been re-enabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "active", // optional cell label, to indicate the latest state of the cell/row
        newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    default:
      // return error message when no action is preformed
      return {success: false, message:'Reached undefined state',  newState: "redo",}
  }
});


export const updateUserRoles = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  const {firstName,uid,roles} = row

  switch (action){
    case 'run':
    case 'redo':
      const user = await auth.getUser(uid)
      // set user's roles
      const updatedClaims = { ...user.customClaims,roles };
      await auth.setCustomUserClaims(user.uid, updatedClaims);
      return {success: true,
        message: `${firstName}'s roles have been updated`,
        cellStatus: `Roles:${roles.join(', ')}`,
        newState: "redo", 
      };
    default: return {success: false, message:'Reached undefined state',  newState: "redo"}
  }

})