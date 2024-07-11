export default abstract class Configuration<T> {
    beanName = "default";
    bean: T = undefined as T;
    abstract load(): void;
}
