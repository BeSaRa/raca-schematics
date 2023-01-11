import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {EServiceOptions} from "./e-service-options";
import {EServiceOptionsModel} from "./e-service-options-model";
import {updateCaseType} from "./updateCaseType";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function eService(_options: EServiceOptions): Rule {
    return async (host: Tree, _context: SchematicContext) => {
        const options = new EServiceOptionsModel(_options)

        return chain([
            updateCaseType(options.enumName, options.caseType)
        ])
    };
}
