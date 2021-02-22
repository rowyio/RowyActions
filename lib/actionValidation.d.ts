import * as FirebaseFirestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
declare const validateAction: ({ context, row, schemaSnapshot, column, }: {
    context: functions.https.CallableContext;
    row: FirebaseFirestore.DocumentData;
    schemaSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
    column: {
        key: string;
    };
}) => boolean;
export default validateAction;
