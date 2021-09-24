
import {auth} from "../firebaseConfig";
import callableAction from "rowy-actions";

export const UpdateUserRoles = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  const {firstName, email, roles} = row;
  const user = await auth.getUserByEmail(email);
  const updatedClaims = {...user.customClaims, roles};
  switch (action) {
    case "run":
    case "redo":
      // set user's roles
      await auth.setCustomUserClaims(user.uid, updatedClaims);
      break;
    default:
      break;
  }
  return ({success: true,
    message: `${firstName}'s roles have been updated`,
    cellStatus: `Roles:${roles.join(", ")}`,
    newState: "redo"});
});
