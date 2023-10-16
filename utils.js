// Sort the items array by name in alphabetical order
export function sortItems(items) {
    if (items.length < 2) {
        return items; // Return the array as is, no need to sort
    }
    
    return items.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}