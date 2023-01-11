import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile, EnumDeclaration,
    ScriptTarget,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";
import {insertToEnum} from "./insertToEnum";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export function updateServicePermission(key: string, value: string): Rule {
    const path = 'src/app/enums/e-service-permissions-enum.ts'
    return (host: Tree) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const identifier = findNode(source, SyntaxKind.Identifier, 'EServicePermissionsEnum')

        if (!identifier) {
            throw new SchematicsException('there is no Identifier EServicePermissionsEnum')
        }
        const declaration = identifier.parent as EnumDeclaration
        const change = insertToEnum(declaration, key, `'${value}'`)
        const recorder = host.beginUpdate(path)
        applyToUpdateRecorder(recorder, [change])
        host.commitUpdate(recorder)
        return host
    }
}
