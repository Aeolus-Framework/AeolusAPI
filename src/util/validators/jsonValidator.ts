export function objectIsEmpty(obj: object): boolean {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}
