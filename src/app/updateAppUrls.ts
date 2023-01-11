import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile,
    InterfaceDeclaration,
    isIndexSignatureDeclaration,
    ScriptTarget,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode, findNodes} from "@schematics/angular/utility/ast-utils";
import {applyToUpdateRecorder, InsertChange} from "@schematics/angular/utility/change";

export function updateAppUrls(urlName: string): Rule {
    const path = 'src/app/interfaces/i-app-urls.ts'
    return (host: Tree) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const urls = findNode(source, SyntaxKind.Identifier, 'IAppUrls')
        if (!urls) {
            throw new SchematicsException('there is no Appurls')
        }
        const declaration = urls.parent as InterfaceDeclaration
        const signature = findNodes(declaration, isIndexSignatureDeclaration)[0]
        const matches = signature.getFullText().match(/^(\r?\n)(\s*)/)
        const recorder = host.beginUpdate(path)
        applyToUpdateRecorder(recorder, [new InsertChange(path, signature.pos, (matches ? matches[0] : '') + `${urlName}: string;`)])
        host.commitUpdate(recorder)
        return host
    }
}
