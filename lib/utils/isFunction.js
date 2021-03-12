export function isFunction(str) {
    const mathing_1 = str.match('\\((.*)\\)(.*)=>(.*){(.*)}');
    const mathing_2 = str.match('function(.*)\\((.*)\\)(.*){(.*)}');

    if (mathing_1 || mathing_2)
        return true

    return false
}
