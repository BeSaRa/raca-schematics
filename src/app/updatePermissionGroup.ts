import {Rule, SchematicsException} from "@angular-devkit/schematics";
import {
    ArrayLiteralExpression,
    createSourceFile,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodeValue} from "./findNodeValue";
import {insertToArray} from "./insertToArray";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

export interface modulesMap {
    "general-services": string
    "collection": string
    "office-services": string
    "projects": string
    "remittances": string
    "urgent-intervention": string
}

export function updatePermissionGroup(modelName: keyof modulesMap, enumName: string): Rule {
    const path = 'src/app/resources/permission-groups.ts'
    const identifiers: modulesMap = {
        "general-services": "generalServicesPermissionsGroup",
        "collection": "collectionServicesPermissionsGroup",
        "office-services": "officeServicesPermissionsGroup",
        "projects": "projectServicesPermissionsGroup",
        "remittances": "remittanceServicesPermissionsGroup",
        "urgent-intervention": "urgentInterventionServicesPermissionsGroup"
    }
    const selected = identifiers[modelName]
    return (host) => {
        const content = host.readText(path)
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)

        const permissions = findNodeValue<ArrayLiteralExpression>(source, selected)
        if (!permissions)
            throw new SchematicsException(`there is no permission group for ${selected}`)

        const change = insertToArray(permissions, `EServicePermissionsEnum.${enumName}`)
        const recorder = host.beginUpdate(path)
        applyToUpdateRecorder(recorder, [change])
        host.commitUpdate(recorder)
        return host
    }
}
