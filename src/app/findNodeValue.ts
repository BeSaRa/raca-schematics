import {
    isVariableDeclaration,
    Node,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";

export function findNodeValue<T>(source: Node, nodeName: string): T | null {
    const find = findNode(source, SyntaxKind.Identifier, nodeName)
    if (!find) {
        return null
    }

    if (!isVariableDeclaration(find.parent)) {
        return null
    }
    return find.parent.initializer as unknown as T
}
