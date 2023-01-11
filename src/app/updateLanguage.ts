import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile,
    InterfaceDeclaration,
    ScriptTarget,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";
import {applyToUpdateRecorder, InsertChange} from "@schematics/angular/utility/change";

export function updateLanguage(key: string): Rule {
    const path = 'src/app/interfaces/i-language-keys.ts'
    return (host: Tree) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const node = findNode(source, SyntaxKind.Identifier, 'ILanguageKeys')

        if (!node) {
            throw new SchematicsException('there is no ILanguageKeys')
        }

        const declaration = node.parent as InterfaceDeclaration

        const recorder = host.beginUpdate(path)
        const matches = (declaration.members[0] || declaration.members).getFullText().match(/^(\r?\n)(\s*)/);
        applyToUpdateRecorder(recorder, [
            new InsertChange(path, declaration.members.pos, (matches ? matches[0] : '') + (`${key} : string;`))
        ])
        host.commitUpdate(recorder)
        return host
    }
}
