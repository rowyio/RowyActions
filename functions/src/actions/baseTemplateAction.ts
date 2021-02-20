import * as functions from "firebase-functions";
import {db} from "../firebaseConfig";
import validateAction from "../actionValidation";
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

export const testAction = functions.https.onCall(
    async (data: ActionData, context: functions.https.CallableContext) => {
      try {
        const {ref, column, schemaDocPath} = data;
        // fetch the row and the table schema snapshots
        const [schemaSnapshot, rowSnapshot] = await Promise.all([
          db.doc(schemaDocPath).get(),
          db.doc(ref.path).get(),
        ]);
        const row = rowSnapshot.data();
        // preforms validation of the required conditions for action to run
        validateAction({context, row, schemaSnapshot, column});

        return {
          success: true,
          message: "success",
        };
      } catch (error) {
        return {
          success: false,
          error,
          message: error.message,
        };
      }
    });
