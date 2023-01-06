import {applyToUpdateRecorder, Change} from "@schematics/angular/utility/change";
import {Tree} from "@angular-devkit/schematics";

export function changeCommitter(tree: Tree, callback: () => Change[] | Change): Tree {
    let changes = callback()
    if (!Array.isArray(changes)) {
        changes = [changes]
    }
    const recorder = tree.beginUpdate(changes[0].path!)
    applyToUpdateRecorder(recorder, changes)
    tree.commitUpdate(recorder)
    return tree
}
