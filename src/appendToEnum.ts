import * as ts from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {Change, InsertChange} from "@schematics/angular/utility/change";
import {SchematicsException} from "@angular-devkit/schematics";
import {findNode} from "@schematics/angular/utility/ast-utils";

export function appendToEnum(node: ts.EnumDeclaration, key: string, value?: number | string): Change {
    const hasComma = node.members.hasTrailingComma;
    const lastNode = node.members.length ? node.members[node.members.length - 1] : node
    const path = node.getSourceFile().fileName;
    let toAdd = '';
    const position = node.members.length ? lastNode.getEnd() + (hasComma ? 1 : 0) : node.getEnd() - 1

    if (!key)
        throw new SchematicsException('Please Provide the Enum Key');

    const exists = findNode(node, ts.SyntaxKind.Identifier, key)

    if (exists)
        throw new SchematicsException(`the enum key exists before ${key}`);

    const matches = lastNode.getFullText().match(/^(\r?\n)(\s*)/)
    toAdd = (!hasComma && node.members.length ? ',' : '') + (matches ? (matches[0] + key) : key)

    if (value) {
        toAdd = (toAdd + ' = ' + (typeof value === 'string' ? `'${value}'` : value.toString()))
    }
    return new InsertChange(path, position, toAdd)
}
