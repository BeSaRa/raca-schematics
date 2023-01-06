import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import * as ts from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodes} from "@schematics/angular/utility/ast-utils";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";
import {appendToEnum} from "../appendToEnum";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const filePath = 'app/case-types.ts';
        const fileContent = tree.readText(filePath);
        const source = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true)
        let caseType = findNodes(source, ts.SyntaxKind.EnumDeclaration)[0] as ts.EnumDeclaration
        if (caseType === null) {
            throw new SchematicsException('Please Provide the Case Type Enum')
        }
        const recorder = tree.beginUpdate(filePath)

        applyToUpdateRecorder(recorder, [
            appendToEnum(caseType, 'SECOND_SERVICE', 'SECOND_SERVICE')
        ])
        tree.commitUpdate(recorder)
        return tree
    };
}
