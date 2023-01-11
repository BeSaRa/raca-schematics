import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {EServiceOptions} from "../e-service/e-service-options";
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: EServiceOptions): Rule {

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
        // const path = 'app/service-change.ts'
        // const content = tree.readText(path);
        // const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        // const blocks = findNodes(source, isArrowFunction, 1)
        //
        // if (!blocks.length) {
        //     throw new SchematicsException('Please ')
        // }
        // const block = blocks[0].body as Block
        // changeCommitter(tree, () => {
        //     const statement = 'DynamicComponentService.registerComponent(\'OrganizationsEntitiesSupportComponent\', OrganizationsEntitiesSupportComponent);'
        //     return insertStatement(block, statement)
        // })
        // blocks.forEach((item, index) => {
        //     console.log(`========BLOCK (${index}) START==============`);
        //     console.log(item.getFullText());
        //     console.log(`========BLOCK (${index}) END==============`);
        //     console.log(item);
        // })

        return tree
    };
}
