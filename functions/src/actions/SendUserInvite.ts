
import {db, auth} from "../firebaseConfig";
import callableAction from "firetable-actions";
import {sendInviteEmail} from "../email";

const randomUid = () =>Date.now().toString(36) + Math.random().toString(36).substr(2);

export const SendUserInvite = callableAction(async ({row, callableData}) =>{
  const {action, ref} = callableData;
  const {firstName, lastName, email, roles} =row;
  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
      // create firebase auth user
      try {
        // fetch user from firebase auth based on the invite email
        const user = await auth.getUserByEmail(email);
        await db.doc(ref.path).update({uid: user.uid});
        // set user's roles
        const updatedClaims = {...user.customClaims, roles};
        await auth.setCustomUserClaims(user.uid, updatedClaims);
      } catch (e) {
        // if firebase auth user does not exist then create an empty user with
        const uid = randomUid();
        await auth.importUsers([
          {
            uid,
            displayName: `${firstName} ${lastName}`,
            email,
            // set users roles
            customClaims: {roles},
          },
        ]);
        await db.doc(ref.path).update({uid});
      }
      await sendInviteEmail(firstName, email);
      break;
    case "redo": {
      // send/resend invite email
      await sendInviteEmail(firstName, email);
      break;
    }

    case "undo":
      // this case is never reached because
      break;
    default:
      break;
  }

  return {success: true, // return if the operation was success
    message: `An invite was sent to ${row.firstName} on ${row.email}`, // message shown in snackbar on the firetable ui after the completion of action
    cellStatus: "invited", // optional cell label, to indicate the latest state of the cell/row
    newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
  };
});

