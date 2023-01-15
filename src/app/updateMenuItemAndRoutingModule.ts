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
import {addDeclarationToModule, findNodes} from "@schematics/angular/utility/ast-utils";
import {insertToArray} from "./insertToArray";
import {applyToUpdateRecorder} from "@schematics/angular/utility/change";
import {EServiceOptions} from "../e-service/e-service-options";

const createMenuItem = (name: string,
                        enumName: string,
                        options: SelectedModuleOptions) => {
    return `{
    id: ${options.id},
    langKey: '${options.langKey}',
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

export function updateMenuItemAndRoutingModule(options: EServiceOptions): Rule {
    const path = 'src/app/resources/navigation-menu-list.ts'
    const moduleOptions: Record<keyof ModulesMap, SelectedModuleOptions> = {
        "general-services": {
            id: 0,
            parent: 13,
            group: 'general-services',
            langKey: options.menuKey,
            routing: 'src/app/modules/general-services/general-services-routing.module.ts',
            module: 'src/app/modules/general-services/general-services.module.ts'
        },
        "collection": {
            id: 0,
            parent: 43,
            group: 'collection',
            langKey: options.menuKey,
            routing: 'src/app/modules/collection/collection-routing.module.ts',
            module: 'src/app/modules/collection/collection.module.ts'
        },
        "office-services": {
            id: 0,
            parent: 59,
            group: 'office-services',
            langKey: options.menuKey,
            routing: 'src/app/modules/office-services/office-services-routing.module.ts',
            module: 'src/app/modules/office-services/office-services.module.ts',
        },
        "projects": {
            id: 0,
            parent: 32,
            group: 'projects',
            langKey: options.menuKey,
            routing: 'src/app/modules/projects/projects-routing.module.ts',
            module: 'src/app/modules/projects/projects.module.ts'
        },
        "remittances": {
            id: 0,
            parent: 48,
            group: 'remittance',
            langKey: options.menuKey,
            routing: 'src/app/modules/remittances/remittances-routing.module.ts',
            module: 'src/app/modules/remittances/remittances.module.ts'
        },
        "urgent-intervention": {
            id: 0,
            parent: 60,
            group: 'urgent-intervention',
            langKey: options.menuKey,
            routing: 'src/app/modules/urgent-intervention/urgent-intervention-routing.module.ts',
            module: 'src/app/modules/urgent-intervention/urgent-intervention.module.ts'
        }
    }
    const selectedOptions = moduleOptions[options.underModule]
    return (host) => {
        const content = host.readText(path)
        const source = createSourceFile(path, content, ScriptTarget.Latest, true)
        const navigation = findNodeValue<ArrayLiteralExpression>(source, 'navigationMenuList')
        const routingContent = host.readText(selectedOptions.routing)
        const routingSource = createSourceFile(selectedOptions.routing, routingContent, ScriptTarget.Latest, true)
        const moduleContent = host.readText(selectedOptions.module)
        const moduleSource = createSourceFile(selectedOptions.module, moduleContent, ScriptTarget.Latest, true)
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

        const change = insertToArray(routingArray, createRoute(options.name, options.enumName, options.routeName))
        const routeRecorder = host.beginUpdate(selectedOptions.routing)
        applyToUpdateRecorder(routeRecorder, [change])
        host.commitUpdate(routeRecorder)

        const menuChange = insertToArray(menuArray, createMenuItem(options.name, options.enumName, selectedOptions))
        const menuRecorder = host.beginUpdate(path)
        applyToUpdateRecorder(menuRecorder, [menuChange])
        host.commitUpdate(menuRecorder)

        const componentDeclarationChange = addDeclarationToModule(moduleSource, selectedOptions.module, (options.name + 'Component'), options.componentPath)
        const componentDeclarationRecorder = host.beginUpdate(selectedOptions.module)
        applyToUpdateRecorder(componentDeclarationRecorder, componentDeclarationChange)
        host.commitUpdate(componentDeclarationRecorder)


        const latestModuleContent = host.readText(selectedOptions.module)
        const latestModuleSource = createSourceFile(selectedOptions.module, latestModuleContent, ScriptTarget.Latest, true)

        const declareChange = addDeclarationToModule(latestModuleSource, selectedOptions.module, options.approvalName, options.approvalPath)
        const declareRecorder = host.beginUpdate(selectedOptions.module)
        applyToUpdateRecorder(declareRecorder, declareChange)
        host.commitUpdate(declareRecorder)

        return host
    }
}
