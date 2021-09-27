/// <reference types="express" />
import * as FirebaseFirestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
declare type ActionData = {
    ref: FirebaseFirestore.DocumentReference;
    schemaDocPath: string;
    column: {
        key: string;
    };
    action: "run" | "redo" | "undo";
};
declare type ActionResponse = {
    success: boolean;
    message: string;
    cellStatus?: string;
    newState?: "redo" | "undo" | "disabled";
};
declare const callableAction: (actionScript: (args: {
    callableData: ActionData;
    context: functions.https.CallableContext;
    row: FirebaseFirestore.DocumentData;
}) => ActionResponse | Promise<ActionResponse>) => functions.TriggerAnnotated & ((req: functions.Request<import("express-serve-static-core").ParamsDictionary>, resp: functions.Response<any>) => void | Promise<void>) & functions.Runnable<any>;
export default callableAction;
