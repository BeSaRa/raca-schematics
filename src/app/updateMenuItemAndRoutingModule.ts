import {Rule, SchematicsException} from "@angular-devkit/schematics";
import {ModulesMap, SelectedModuleOptions} from "../e-service/modulesMap";
import {strings} from "@angular-devkit/core";
import {
    ArrayLiteralExpression,
    createSourceFile,
    isVariableDeclaration,
    ScriptTarget
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import {findNodeValue} from "./findNodeValue";
import {findNodes} from "@schematics/angular/utility/ast-utils";
import {insertToArray} from "./insertToArray";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";

const createMenuItem = (name: string,
                        enumName: string,
                        options: SelectedModuleOptions) => {
    return `{
    id: ${options.id},
    langKey: 'menu_${options.langKey}',
    path: '/home/${options.group}/${strings.dasherize(name)}',
    icon: 'mdi-badge-account-horizontal-outline',
    isSvg: false,
    permission: EServicePermissionsEnum.${enumName},
    permissionGroup: null,
    parent: ${options.parent},
    group: '${options.group}',
    itemOrder: 25,
    svg: null
  }`
}

const createRoute = (name: string, enumName: string, routeName: string) => {
    return `{
    path: '${routeName}', component: EServiceComponentWrapperComponent,
    canActivate: [ServicesGuard],
    resolve: { info: ServiceItemResolver },
    data: {
      permissionKey: EServicePermissionsEnum.${enumName},
      configPermissionGroup: null,
      checkAnyPermission: false,
      render: '${name}Component'
    }
  }`
}

export function updateMenuItemAndRoutingModule(name: string, menuKey: string, enumName: string, underModule: keyof ModulesMap, routName: string): Rule {
    const path = 'src/app/resources/navigation-menu-list.ts'
    const routingPath = 'app/general-services-routing.module.ts' // for testing purpose
    const moduleOptions: Record<keyof ModulesMap, SelectedModuleOptions> = {
        "general-services": {
            id: 0,
            parent: 13,
            group: 'general-services',
            langKey: menuKey,
            routing: 'src/app/modules/general-services/general-services-routing.module.ts'
        },
        "collection": {
            id: 0,
            parent: 43,
            group: 'collection',
            langKey: menuKey,
            routing: 'src/app/modules/collection/collection-routing.module.ts'
        },
        "office-services": {
            id: 0,
            parent: 59,
            group: 'office-services',
            langKey: menuKey,
            routing: 'src/app/modules/office-services/office-services-routing.module.ts'
        },
        "projects": {
            id: 0,
            parent: 32,
            group: 'projects',
            langKey: menuKey,
            routing: 'src/app/modules/projects/projects-routing.module.ts'
        },
        "remittances": {
            id: 0,
            parent: 48,
            group: 'remittance',
            langKey: menuKey,
            routing: 'src/app/modules/remittances/remittances-routing.module.ts'
        },
        "urgent-intervention": {
            id: 0,
            parent: 60,
            group: 'urgent-intervention',
            langKey: menuKey,
            routing: 'src/app/modules/urgent-intervention/urgent-intervention-routing.module.ts'
        }
    }
    const selectedOptions = moduleOptions[underModule]
    return (host) => {
        const content = host.readText(path)
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const navigation = findNodeValue<ArrayLiteralExpression>(source, 'navigationMenuList')
        const routingContent = host.readText(selectedOptions.routing)
        const routingSource = createSourceFile(selectedOptions.routing, routingContent, ScriptTarget.Latest, true)

        if (!navigation) {
            throw new SchematicsException('there is no menu navigation list here')
        }

        selectedOptions.id = navigation.elements.length + 1

        const variables = findNodes(routingSource, isVariableDeclaration)
        const menuVariables = findNodes(source, isVariableDeclaration)

        if (!variables.length || !menuVariables.length) {
            throw new SchematicsException('there is no routes defined in this module')
        }

        const routingArray = variables[0].initializer as ArrayLiteralExpression;
        const menuArray = menuVariables[0].initializer as ArrayLiteralExpression;

        const change = insertToArray(routingArray, createRoute(name, enumName, routName))
        const routeRecorder = host.beginUpdate(selectedOptions.routing)
        applyToUpdateRecorder(routeRecorder, [change])
        host.commitUpdate(routeRecorder)

        const menuChange = insertToArray(menuArray, createMenuItem(name, enumName, selectedOptions))
        const menuRecorder = host.beginUpdate(path)
        applyToUpdateRecorder(menuRecorder, [menuChange])
        host.commitUpdate(menuRecorder)
        return host
    }
}
