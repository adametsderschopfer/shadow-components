export function getElementByAttribute(attribute, context) {
    let nodeList = (context || document).querySelector('*');
    let nodeArray = [];
    let iterator = 0;
    let node = null;

    while (node = nodeList[iterator++]) {
        if (node.hasAttribute(attribute)) nodeArray.push(node);
    }

    return nodeArray;
}
