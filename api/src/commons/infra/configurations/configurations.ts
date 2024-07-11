import Configuration from "/opt/nodejs/infra/configurations/configuration";

export default class Configurations {
    private static instance: Configurations;

    private configs: Configuration<any>[];

    private constructor() {
        this.configs = [];
    }

    public static getInstance(): Configurations {
        if (!Configurations.instance) {
            Configurations.instance = new Configurations();
        }
        return Configurations.instance;
    }

    public add<T>(config: Configuration<T>) {
        if (this.configs.find((c: Configuration<T>) => c.beanName === config.beanName)) {
            return false;
        }
        this.configs.push(config);
        return true;
    }

    public addAll<T>(configs: Configuration<T>[]) {
        configs.forEach((c) => this.add(c));
    }

    public load<T>(): void {
        this.configs.forEach(async (config: Configuration<T>) => {
            config.load();
        });
    }

    static getBean<T>(beanName: string): T {
        const config = Configurations.instance.configs.find((c) => c.beanName === beanName);
        return config?.bean;
    }
}
