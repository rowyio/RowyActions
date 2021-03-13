
import {auth} from "../firebaseConfig";
import callableAction from "firetable-actions";

export const updateUserRoles = callableAction(async ({row, callableData}) =>{
  const {action} = callableData;
  const {firstName, uid, roles} = row;

  switch (action) {
    case "run":
    case "redo": {
      const user = await auth.getUser(uid);
      // set user's roles
      const updatedClaims = {...user.customClaims, roles};
      await auth.setCustomUserClaims(user.uid, updatedClaims);
      return {success: true,
        message: `${firstName}'s roles have been updated`,
        cellStatus: `Roles:${roles.join(", ")}`,
        newState: "redo",
      };
    }
    default: return {success: false, message: "Reached undefined state", newState: "redo"};
  }
});
