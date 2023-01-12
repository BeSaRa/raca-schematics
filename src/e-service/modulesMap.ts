export interface ModulesMap {
    "general-services": string
    "collection": string
    "office-services": string
    "projects": string
    "remittances": string
    "urgent-intervention": string
}

export interface SelectedModuleOptions {
    id: number
    parent: number,
    group: string,
    langKey: string,
    routing: string,
    module: string
}
