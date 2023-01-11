import {strings} from "@angular-devkit/core";
import {EServiceOptions} from "./e-service-options";
import {ModulesMap} from "./modulesMap";

export class EServiceOptionsModel implements EServiceOptions {
    fileName: string;
    name: string;
    servicePath: string;
    modelPath: string;
    enumName: string;
    urlName: string;
    endPoint: string;
    caseType: number;
    underModule: keyof ModulesMap
    menuKey: string;

    constructor(options: EServiceOptions) {
        this.init(options.name)
        this.endPoint = options.endPoint
        this.caseType = Number(options.caseType)
        this.underModule = options.underModule
    }

    private init(name: string): void {
        this.name = strings.classify(name)
        this.fileName = strings.dasherize(this.name)
        this.servicePath = '@services/' + this.fileName + '.service';
        this.modelPath = '@models/' + this.fileName;
        this.enumName = this.urlName = strings.underscore(this.name).toUpperCase()
        this.menuKey = 'menu_' + strings.underscore(name).toLowerCase()
    }

}
