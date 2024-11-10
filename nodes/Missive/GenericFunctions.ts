import { INodePropertyOptions } from "n8n-workflow";

/**
 * Sorts the given options alphabetically
 *
 */
export function sortOptions(options: INodePropertyOptions[]): void {
  options.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}