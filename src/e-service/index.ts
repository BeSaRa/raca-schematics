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
import {updateMenuItemAndRoutingModule} from "../app/updateMenuItemAndRoutingModule";
import {updateAutoRegisterService} from "../app/updateAutoRegisterService";

export function eService(_options: EServiceOptions): Rule {
    return async (host: Tree, _context: SchematicContext) => {
        const options = new EServiceOptionsModel(_options)

        const templateSource = apply(url('./files'), [
            applyTemplates({
                ...options,
                ...strings
            }),
            move('.')
        ])

        return chain([
            mergeWith(templateSource),
            updateCaseType(options.enumName, options.caseType),
            updateMenuItemAndRoutingModule(options),
            updateRequestTypeFollowupService(options.enumName),
            updateAppUrls(options.urlName),
            updateLanguage(options.menuKey),
            updateEndPoint(options.urlName, options.endPoint),
            updateServicePermission(options.enumName, options.enumName),
            updateGeneralSearchInterceptor(options.enumName, options.name, options.interceptorPath),
            updatePermissionGroup(options.underModule, options.enumName),
            updateInboxService(options.enumName, options.name, options.servicePath),
            updateAutoRegisterService(options)
        ])
    };
}
