import { sign } from "crypto";
import { validateStringType } from "../../helpers/typeValidator";
import { DBResponse } from "../../types";
import IAuth from "./IAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuthClient } from "../../config/firebase_config";
import Log from "../../helpers/logger";


class FirebaseAuth implements IAuth {

    async login(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        const{email,password} = data;
        if(!email || !password){
            return Promise.resolve({
                success: false,
                message: 'Email and password are required',
                status: 400,
            });
        }
        try {
            validateStringType({
                values: [email,password],
                errorMessage: 'Email and password must be of type string',
            });
            const result = await signInWithEmailAndPassword(
                firebaseAuthClient,
                email as string ,
                password as string);

                const token = await result.user.getIdToken();
                Log.quiet('ID Token:',token);

                return Promise.resolve({
                    success: true,
                    message: 'User logged in successfully',
                    status: 200,
                    data: {token,uid: result.user.uid}, 
                });
            
        } catch (error) {
            return {
                success: false,
                message: "Failed to login: " + (error as Error).message,
                status: 500,
            }
            
        }
    }

    logout(token?: string): Promise<DBResponse<void>> {
        throw new Error("Method not implemented.");
    }
    register(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        throw new Error("Method not implemented.");
    }

}
export default FirebaseAuth;