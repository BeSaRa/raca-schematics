import {strings} from "@angular-devkit/core";
import {EServiceOptions} from "./e-service-options";

export class EServiceOptionsModel implements EServiceOptions {
    fileName: string;
    name: string;
    servicePath: string;
    modelPath: string;
    enumName: string;
    urlName: string;
    endPoint: string;
    caseType: number
    underModule: string

    constructor(options: EServiceOptions) {
        this.init(options.name)
        this.endPoint = options.endPoint
        this.caseType = Number(options.caseType)
        this.underModule = options.underModule
    }

    private init(name: string): void {
        this.name = strings.classify(name)

        this.fileName = strings.dasherize(this.name)
        this.servicePath = '@app/services/' + this.fileName + '.service';
        this.modelPath = '@app/models/' + this.fileName;
        this.enumName = this.urlName = strings.underscore(this.name).toUpperCase()
    }

}
