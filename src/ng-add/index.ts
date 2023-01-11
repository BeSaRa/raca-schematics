import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {EServiceOptions} from "../e-service/e-service-options";

export function ngAdd(_options: EServiceOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        return tree
    };
}
