import Configuration from "/opt/nodejs/infra/configurations/configuration";
import Configurations from "/opt/nodejs/infra/configurations/configurations";
import { AuthContext } from "/opt/nodejs/infra/auth/context";
import { AuthManager } from "/opt/nodejs/infra/auth/manager";

export class AuthContextConfig extends Configuration<AuthContext> {
    constructor() {
        super();
        this.beanName = AuthContextConfigBean.BEAN_NAME;
    }

    load(): void {
        this.bean = new AuthContext(new AuthManager());
    }
}

export class AuthContextConfigBean {
    static readonly BEAN_NAME = "AuthContext";

    static get(): AuthContext {
        return Configurations.getBean(AuthContextConfigBean.BEAN_NAME);
    }
}
