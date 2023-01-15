import {ModulesMap} from "./modulesMap";

export interface EServiceOptions {
    caseType: number;
    name: string,
    endPoint: string
    fileName: string
    servicePath: string
    modelPath: string
    enumName: string
    urlName: string;
    underModule: keyof ModulesMap
    menuKey: string
    routeName: string
    interceptorPath: string;
    approvalName: string
    approvalPath: string
    componentPath: string;
}
