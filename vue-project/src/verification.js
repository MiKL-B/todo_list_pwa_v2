import { notification } from "./notification";
export function emptyName(name) {
    let isEmpty = false;
    if (name === "") {
        isEmpty = true;
        notification("error","Empty name")
    }
    return isEmpty;
}
export function existingName(arr, name) {
    let isExist = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === name) {
            isExist = true;
            notification("error","Name already exists")
        }
    }
    return isExist;
}