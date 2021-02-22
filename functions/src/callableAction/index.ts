import * as FirebaseFirestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {db} from "../firebaseConfig";
import validateAction from "./actionValidation";
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

type ActionData = {
    ref: {
      id: string;
      path: string;
      parentId: string;
      tablePath: string;
    };
    schemaDocPath: string;// docPath of
    column: {key: string};
    action: "run" | "redo" | "undo";
  };

type ActionResponse ={
  success:boolean;
  message:string;
  cellStatus?:string;
  newState:"redo"|"undo"|"disabled";
}
const callableAction=(
    actionScript:(args:{callableData:ActionData, context: functions.https.CallableContext, row:FirebaseFirestore.DocumentData})=>
    ActionResponse|Promise<ActionResponse>) =>
  functions.https.onCall(async (callableData: ActionData, context: functions.https.CallableContext) => {
    try {
      const {ref, column, schemaDocPath} = callableData;
      // fetch the row and the table schema snapshots
      const [schemaSnapshot, rowSnapshot] = await Promise.all([
        db.doc(schemaDocPath).get(),
        db.doc(ref.path).get(),
      ]);
      const row = rowSnapshot.data();
      // preforms validation of the required conditions for action to run
      if (!row) {
        throw Error("Row is undefined");
      }
      validateAction({context, row, schemaSnapshot, column});
      const result = await actionScript({callableData, context, row});
      if (result.success) {
        return {
          ...result,
          cellValue: {
            redo: result.newState === "redo",
            status: result.cellStatus,
            completedAt: serverTimestamp(),
            ranBy: context.auth!.token.email,
            undo: result.newState === "undo",
          },
        };
      } return result;
    } catch (error) {
      return {
        success: false,
        error,
        message: error.message,
      };
    }
  });

export default callableAction;
