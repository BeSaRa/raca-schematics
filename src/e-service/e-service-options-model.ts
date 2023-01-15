import {strings} from "@angular-devkit/core";
import {EServiceOptions} from "./e-service-options";
import {ModulesMap} from "./modulesMap";

export class EServiceOptionsModel implements EServiceOptions {
    fileName: string;
    name: string;
    servicePath: string;
    modelPath: string;
    interceptorPath: string;
    enumName: string;
    urlName: string;
    endPoint: string;
    caseType: number;
    underModule: keyof ModulesMap
    menuKey: string;
    routeName: string;
    approvalName: string;
    approvalPath: string;
    componentPath: string;

    constructor(options: EServiceOptions) {
        this.endPoint = options.endPoint
        this.caseType = Number(options.caseType)
        this.underModule = options.underModule
        this.init(options.name)
    }

    private init(name: string): void {
        this.name = strings.classify(name)
        this.fileName = this.routeName = strings.dasherize(this.name)
        this.servicePath = '@services/' + this.fileName + '.service';
        this.modelPath = '@models/' + this.fileName;
        this.interceptorPath = '@model-interceptors/' + this.fileName + '-interceptor'
        this.enumName = this.urlName = strings.underscore(this.name).toUpperCase()
        this.menuKey = 'menu_' + strings.underscore(name).toLowerCase()
        this.approvalName = this.name + 'ApproveTaskPopupComponent';
        this.approvalPath = `@modules/${this.underModule}/popups/${strings.dasherize(this.name)}-approve-task-popup/${strings.dasherize(this.name)}-approve-task-popup.component`
        this.componentPath = `@modules/${this.underModule}/pages/${strings.dasherize(this.name)}/${strings.dasherize(this.name)}.component`
    }

}
