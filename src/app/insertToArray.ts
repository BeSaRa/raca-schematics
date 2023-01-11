import {Change, InsertChange} from "@schematics/angular/utility/change";
import {ArrayLiteralExpression} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";

export function insertToArray(node: ArrayLiteralExpression, toAdd: string): Change {
    const hasItems = node.elements.length
    const hasComma = node.elements.hasTrailingComma
    const lastNode = hasItems ? node.elements[node.elements.length - 1] : node;
    const matches = lastNode.getFullText().match(/^(\r?\n)(\s*)/);
    const position = (hasComma ? lastNode.getEnd() + 1 : lastNode.getEnd()) + (hasItems ? 0 : -1)
    if (matches) {
        toAdd = (!hasComma ? ',' : '') + matches[0] + toAdd
    } else {
        toAdd = '\n\t' + toAdd + '\n'
    }
    return new InsertChange(node.getSourceFile().fileName, position, toAdd)
}
