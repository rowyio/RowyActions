import {auth} from "../firebaseConfig";
import callableAction from "firetable-actions";
export const SuspendUser = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  const {firstName, uid} = row;
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    case "redo":
      // both run and redo preform the same action; disabling the user's account from firebase auth
      await auth.updateUser(uid, {disabled: true});
      return {success: true, // return if the operation was success
        message: `${firstName}'s account has been disabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "disabled", // optional cell label, to indicate the latest state of the cell/row
        newState: "undo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    case "undo":
      // re-enable user's firebase account
      await auth.updateUser(uid, {disabled: false});
      return {success: true, // return if the operation was success
        message: `${firstName}'s account has been re-enabled`, // message shown in snackbar on the firetable ui after the completion of action
        cellStatus: "active", // optional cell label, to indicate the latest state of the cell/row
        newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
      };
    default:
      // return error message when no action is preformed
      return {success: false, message: "Reached undefined state", newState: "redo"};
  }
});
