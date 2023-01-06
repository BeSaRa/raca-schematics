import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {
    ArrayLiteralExpression,
    createSourceFile,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodeValue} from "../findNodeValue";
import {insertToArray} from "../insertToArray";
import {changeCommitter} from "../changeCommitter";
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

        const path = 'app/permissionGroup.ts'
        const content = tree.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const array = findNodeValue<ArrayLiteralExpression>(source, 'remittanceServicesPermissionsGroup')
        if (!array) {
            return tree
        }
        changeCommitter(tree, () => {
            return insertToArray(array, 'EServicePermissionsEnum.PROJECT_FUNDRAISING')
        })
        return tree
    };
}
