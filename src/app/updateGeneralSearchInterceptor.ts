import {Rule, SchematicsException} from "@angular-devkit/schematics";
import {
    createSourceFile,
    ExpressionStatement,
    isCallExpression,
    isExpressionStatement,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodes, insertImport} from "@schematics/angular/utility/ast-utils";
import {applyToUpdateRecorder, InsertChange} from "@schematics/angular/utility/change";

export function updateGeneralSearchInterceptor(enumName: string, name: string, modelPath: string): Rule {
    const path = 'src/app/model-interceptors/general-search-criteria-interceptor.ts'
    return (host) => {
        const content = host.readText(path)
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const statementContent = `interceptors.set(CaseTypes.${enumName}, new ${name}Interceptor());`;
        const statements = findNodes(source, (node): node is ExpressionStatement => {
            return isExpressionStatement(node) && isCallExpression(node.expression) && node.expression.expression.getText() === 'interceptors.set'
        });
        const statement = statements[statements.length - 1]
        if (!statement) {
            throw new SchematicsException(`there is no statement in ${path}`)
        }
        const matches = statement.getFullText().match(/^(\r?\n)(\s*)/)
        const change = new InsertChange(path, statement.end, (matches ? matches[0] : '') + statementContent)
        const recorder = host.beginUpdate(path)

        applyToUpdateRecorder(recorder, [
            change,
            insertImport(source, path, name + 'Interceptor', modelPath)
        ])
        host.commitUpdate(recorder)
        return host
    }
}
