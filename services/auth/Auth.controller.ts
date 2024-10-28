import { DatabaseProviderType, DBResponse } from "../../types";
import FirebaseAuth from "./FirebaseAuth";
import IAuth from "./IAuth";


class AuthController implements IAuth {

    private provider: DatabaseProviderType;
    private auth: IAuth;
    
    constructor(provider: DatabaseProviderType) {
        this.provider = provider;
        this.auth = new FirebaseAuth();
    }
    
        getInstanceOfAuth(): IAuth {
        return this.auth;
    }
    login(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        return this.auth.login(data);
    }
    
    logout(token?: string): Promise<DBResponse<void>> {
        throw new Error("Method not implemented.");
    }
    register(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        throw new Error("Method not implemented.");
    }
    
}
export default AuthController;