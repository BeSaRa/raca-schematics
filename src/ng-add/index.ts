import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {
    createSourceFile,
    ObjectLiteralExpression,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodeValue} from "../findNodeValue";
import {changeCommitter} from "../changeCommitter";
import {insertToObject} from "../insertToObject";
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        // const filePath = 'app/my-enum.ts';
        // const fileContent = tree.readText(filePath);
        // const source = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true)
        // let caseType = findNodes(source, ts.SyntaxKind.EnumDeclaration)[0] as ts.EnumDeclaration
        // if (caseType === null) {
        //     throw new SchematicsException('Please Provide the Case Type Enum')
        // }
        // const recorder = tree.beginUpdate(filePath)
        //
        // applyToUpdateRecorder(recorder, [
        //     insertToEnum(caseType, 'NEW_PERMISSION_KEY_TWO')
        // ])
        // tree.commitUpdate(recorder)
        // const path = 'app/navigation-menu-list.ts';
        // const content = tree.readText(path);
        // const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true)
        // const array = findNodes(source, SyntaxKind.ArrayLiteralExpression)![0] as ArrayLiteralExpression
        // const change = insertToArray(array, '{id:10,name:"Ahmed"}')
        //
        // const recorder = tree.beginUpdate(path)
        // applyToUpdateRecorder(recorder, [change])
        // tree.commitUpdate(recorder)

        const path = 'app/urls.ts'
        const content = tree.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const object = findNodeValue<ObjectLiteralExpression>(source, 'urlsList')
        if (!object) {
            return tree
        }

        changeCommitter(tree, () => {
            return [
                insertToObject(object, 'SERVICE_URL', '/admin/smart-admin'),
                insertToObject(object, 'SERVICE_URL', '/admin/smart-admin')
            ]
        })
        return tree
    };
}
