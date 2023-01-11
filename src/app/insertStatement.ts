import {Block} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {Change, InsertChange} from "@schematics/angular/utility/change";

export function insertStatement(node: Block, statement: string): Change {
    const lastNode = node.statements[node.statements.length - 1];
    const position = lastNode.getEnd();
    const matches = lastNode.getFullText().match(/^(\r?\n)(\s*)/)
    if (matches) {
        statement = matches[0] + statement
    } else {
        statement = '\n' + statement
    }
    return new InsertChange(lastNode.getSourceFile().fileName, position, statement)
}
