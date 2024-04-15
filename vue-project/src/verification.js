export function emptyName(name) {
    let isEmpty = false;
    if (name === "") {
        isEmpty = true;
    }
    return isEmpty;
}
export function existingName(arr, name) {
    let isExist = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === name) {
            isExist = true;
        }
    }
    return isExist;
}