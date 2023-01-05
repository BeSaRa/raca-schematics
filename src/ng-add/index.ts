import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const path = 'src/app/enums/test.ts';

        const content = tree.read(path)
        console.log('READ', content, tree, _context);
        return tree;
    };
}
