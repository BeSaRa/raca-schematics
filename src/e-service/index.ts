import {
    apply,
    applyTemplates,
    chain,
    mergeWith,
    move,
    Rule,
    SchematicContext,
    Tree,
    url
} from '@angular-devkit/schematics';
import {EServiceOptions} from "./e-service-options";
import {EServiceOptionsModel} from "./e-service-options-model";
import {updateServicePermission} from "../app/updateServicePermission";
import {updateGeneralSearchInterceptor} from "../app/updateGeneralSearchInterceptor";
import {updatePermissionGroup} from "../app/updatePermissionGroup";
import {updateInboxService} from "../app/updateInboxService";
import {updateAppUrls, updateCaseType, updateRequestTypeFollowupService} from "../app";
import {updateLanguage} from "../app/updateLanguage";
import {updateEndPoint} from "../app/updateEndPoint";
import {strings} from "@angular-devkit/core";

export function eService(_options: EServiceOptions): Rule {
    return async (host: Tree, _context: SchematicContext) => {
        const options = new EServiceOptionsModel(_options)

        const templateSource = apply(url('./files'), [
            applyTemplates({
                ...options,
                ...strings
            }),
            move('./src')
        ])

        return chain([
            updateCaseType(options.enumName, options.caseType),
            updateRequestTypeFollowupService(options.enumName),
            updateAppUrls(options.urlName),
            updateLanguage(options.menuKey),
            updateEndPoint(options.urlName, options.endPoint),
            updateServicePermission(options.enumName, options.enumName),
            updateGeneralSearchInterceptor(options.enumName, options.name, options.modelPath),
            updatePermissionGroup(options.underModule, options.enumName),
            updateInboxService(options.enumName, options.name, options.servicePath),
            mergeWith(templateSource)
        ])
    };
}
