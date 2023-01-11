import {Rule, SchematicsException} from "@angular-devkit/schematics";
import {
    createSourceFile,
    isBlock,
    isConstructorDeclaration,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodes, insertImport} from "@schematics/angular/utility/ast-utils";
import {insertStatement} from "./insertStatement";
import {strings} from "@angular-devkit/core";
import {applyToUpdateRecorder, InsertChange} from "@schematics/angular/utility/change";

export function updateInboxService(enumName: string, name: string, servicePath: string): Rule {
    const path = 'src/app/services/inbox.service.ts'
    return (host) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)

        const constructors = findNodes(source, isConstructorDeclaration)
        if (!constructors.length) {
            throw new SchematicsException('there is no Constructor for inboxService')
        }

        const constructor = constructors[0]

        const blocks = findNodes(constructor, isBlock)

        if (!blocks.length) {
            throw new SchematicsException('there is no Block for the constructor')
        }
        const paramPosition = constructor.parameters.end
        const hasComma = constructor.parameters.hasTrailingComma;
        const block = blocks[0];
        const blockContent = `this.services.set(CaseTypes.${enumName}, this.${strings.camelize(name)}Service);`
        const injectContent = `private ${strings.camelize(name)}Service: ${name}Service`;
        const matches = constructor.parameters[constructor.parameters.length - 1].getFullText().match(/^(\r?\n)(\s*)/);
        const blockChange = insertStatement(block, blockContent);
        const injectChange = new InsertChange(path, paramPosition, (hasComma ? '' : ',') + (matches ? matches[0] : '') + injectContent)

        const recorder = host.beginUpdate(path);

        applyToUpdateRecorder(recorder, [
            blockChange,
            injectChange,
            insertImport(source, path, (name + 'Service'), servicePath)
        ])

        host.commitUpdate(recorder)
        return host;
    }
}
