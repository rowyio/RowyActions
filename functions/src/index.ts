import * as admin from "firebase-admin";
admin.initializeApp();
import callableAction from "firetable-actions";

const auth = admin.auth()

export const SendUserInvite = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    // create firebase user    
    // set users roles
    case "redo":
    // send/resend invite email 
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
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    case "redo":
      // both run and redo preform the same action; disabling the user's account from firebase auth
      auth.updateUser(row.uid, {disabled:true})
      return {success: true, // return if the operation was success
        message: `${row.firstName}'s account has been disabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "disabled", // optional cell label, to indicate the latest state of the cell/row
        newState: "undo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    case "undo":
      auth.updateUser(row.uid, {disabled:true})
      return {success: true, // return if the operation was success
        message: `${row.firstName}'s account has been re-enabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "invited", // optional cell label, to indicate the latest state of the cell/row
        newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    default:
      return {success: false, message:'Undefined state reached',  newState: "redo",}
  }
});
