import {EServiceOptions} from "../e-service/e-service-options";
import {Rule, SchematicsException} from "@angular-devkit/schematics";
import {
    Block,
    createSourceFile,
    isArrowFunction,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodes, insertImport} from "@schematics/angular/utility/ast-utils";
import {insertStatement} from "./insertStatement";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export function updateAutoRegisterService(options: EServiceOptions): Rule {
    const path = 'src/app/services/auto-register.service.ts';
    return (host) => {
        const content = host.readText(path);
        const source = createSourceFile(path, content, ScriptTarget.Latest, true);
        const functions = findNodes(source, isArrowFunction, 1)
        if (!functions.length) {
            throw new SchematicsException('there is no arrow function')
        }
        const block = functions[0].body as Block
        const statement = `DynamicComponentService.registerComponent('${options.name}Component', ${options.name}Component);`
        const change = insertStatement(block, statement)
        const recorder = host.beginUpdate(path)
        applyToUpdateRecorder(recorder, [change, insertImport(source, path, (options.name+'Component'), options.componentPath)])
        host.commitUpdate(recorder)
        return host
    }
}
