import * as FirebaseFirestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import validateAction from "./actionValidation";
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
    tablePath: string;
  };
  schemaDocPath: string; // docPath of
  column: { key: string };
  action: "run" | "redo" | "undo";
};

type ActionResponse = {
  success: boolean;
  message: string;
  cellStatus?: string;
  newState?: "redo" | "undo" | "disabled";
};
const callableAction = (
  actionScript: (args: {
    callableData: ActionData;
    context: functions.https.CallableContext;
    row: FirebaseFirestore.DocumentData;
  }) => ActionResponse | Promise<ActionResponse>
) =>
  functions.https.onCall(
    async (
      callableData: ActionData,
      context: functions.https.CallableContext
    ) => {
      try {
        const db = admin.firestore();
        const { ref, column, schemaDocPath } = callableData;
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
        validateAction({ context, row, schemaSnapshot, column });
        const result = await actionScript({ callableData, context, row });
        if (missingRequiredFields.length > 0) {
          throw new Error(
            `Missing required fields:${missingRequiredFields.join(", ")}`
          );
        }
        const result: {
          message: string;
          status: string;
          success: boolean;
        } = await eval(
          `async({row,db, ref,auth,utilFns,actionParams,context})=>{${
            action === "undo" ? config["undo.script"] : script
          }}`
        )({
          row,
          db,
          auth, // utilFns,
          ref,
          actionParams, //context
        });
        if (result.success || result.status) {
          const cellValue = {
            redo: result.success ? config["redo.enabled"] : true,
            status: result.status,
            completedAt: serverTimestamp(),
            ranBy: user.email,
            undo: config["undo.enabled"],
          };
          try {
            const userDoc = await db
              .collection("/_rowy_/userManagement/users")
              .doc(user.uid)
              .get();
            const userData = userDoc?.get("user");
    
            await db.doc(ref.path).update({
              [column.key]: cellValue,
              _updatedBy: userData
                ? {
                    ...userData,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  }
                : null,
            });
          } catch (error) {
            // if actionScript code deletes the row, it will throw an error when updating the cell
            console.log(error);
          }
          return {
            ...result,
          }
        } else
          return {
            success: false,
            message: result.message,
          }
      } catch (error) {
        return {
          success: false,
          error,
          message: error.message,
        };
      }
    }
  );

export default callableAction;
