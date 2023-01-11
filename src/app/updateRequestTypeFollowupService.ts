import {Rule, SchematicsException, Tree} from "@angular-devkit/schematics";
import {
    createSourceFile,
    ObjectLiteralExpression,
    PropertyDeclaration,
    ScriptTarget,
    SyntaxKind
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNode} from "@schematics/angular/utility/ast-utils";
import {insertToObject} from "./insertToObject";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export function updateRequestTypeFollowupService(enumName: string): Rule {
    const path = 'src/app/services/request-type-followup.service.ts'
    return (host: Tree) => {
        const content = host.readText(path)
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const node = findNode(source, SyntaxKind.Identifier, 'serviceRequestTypes')
        if (!node) {
            throw new SchematicsException('There is no serviceRequestTypes identifier')
        }
        const object = (node.parent as PropertyDeclaration).initializer as ObjectLiteralExpression
        const change = insertToObject(object, `[CaseTypes.${enumName}]`, 'this.lookupService.listByCategory.ServiceRequestType')
        const record = host.beginUpdate(path)
        applyToUpdateRecorder(record, [change])
        host.commitUpdate(record)
        return host
    }
}
