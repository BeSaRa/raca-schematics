import {Change, InsertChange} from "@schematics/angular/utility/change";
import {
    ObjectLiteralExpression,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";
import {SchematicsException} from "@angular-devkit/schematics";

export function insertToObject(node: ObjectLiteralExpression, key: string, value: string): Change {
    const exists = findNode(node, SyntaxKind.Identifier, key)
    if (exists) {
        throw new SchematicsException('the key exists before! ' + key)
    }
    const hasComma = node.properties.hasTrailingComma;
    const hasChild = node.properties.length;
    const lastNode = hasChild ? node.properties[node.properties.length - 1] : node
    const position = (hasComma ? lastNode.getEnd() + 1 : lastNode.getEnd()) + (hasChild ? 0 : -1)
    const matches = lastNode.getFullText().match(/^(\r?\n)(\s*)/);
    let toAdd


    if (matches) {
        toAdd = !hasComma ? (`,` + matches[0] + (key + ': ' + `${value}`)) : (matches[0] + key + ': ' + `${value}`)
    } else {
        toAdd = '\n\t' + (key + ': ' + `${value}`) + '\n'
    }
    return new InsertChange(node.getSourceFile().fileName, position, toAdd)
}
