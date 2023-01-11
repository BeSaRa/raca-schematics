import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile,
    Identifier,
    ObjectLiteralExpression,
    ScriptTarget,
    SyntaxKind,
    VariableDeclaration
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";
import {insertToObject} from "./insertToObject";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export function updateEndPoint(key: string, value: string): Rule {
    const path = 'src/app/resources/urls-list.ts';
    return (host: Tree) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const node = findNode(source, SyntaxKind.Identifier, 'urlsList') as Identifier
        if (!node) {
            throw new SchematicsException('there is no UrlsList')
        }

        const object = (node.parent as VariableDeclaration).initializer as ObjectLiteralExpression;
        const change = insertToObject(object, key, `'${value}'`)
        const recorder = host.beginUpdate(path);
        applyToUpdateRecorder(recorder, [
            change
        ])
        host.commitUpdate(recorder)
        return host;
    }
}
