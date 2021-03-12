export function idGenerator() {
    const n = Date.now();
    const f = Math.floor;
    const rand = Math.random;

    return `#${f(rand() * n)}-#${f(rand() * n)}-#${f(rand() * n)}-#${f(rand() * n)}`
}
