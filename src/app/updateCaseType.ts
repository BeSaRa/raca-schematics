import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile, EnumDeclaration,
    ScriptTarget, SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodes} from "@schematics/angular/utility/ast-utils";
import {insertToEnum} from "./insertToEnum";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export function updateCaseType(key: string, value: number): Rule {
    const path = 'src/app/enums/case-types.enum.ts'
    return (host: Tree) => {
        const content = host.readText(path);
        const sourceFile = createSourceFile(path, content, ScriptTarget.Latest, true)
        let caseType = findNodes(sourceFile, SyntaxKind.EnumDeclaration)[0] as EnumDeclaration
        if (caseType === null) {
            throw new SchematicsException('Please Provide the Case Type Enum')
        }
        const record = host.beginUpdate(path)
        const change = insertToEnum(caseType, key, value)
        applyToUpdateRecorder(record, [
            change
        ])
        host.commitUpdate(record)
        return host
    }
}
