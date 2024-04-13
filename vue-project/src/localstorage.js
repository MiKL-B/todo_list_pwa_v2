export function saveLocalStorage(key, value, type = "") {
    switch (type) {
        case "array":
            localStorage.setItem(key, JSON.stringify(value));
            break;
        default:
            localStorage.setItem(key, value);
            break;
    }
}

export function getLocalStorage(key, type = "") {
    let value;
    switch (type) {
        case "array":
            value = JSON.parse(localStorage.getItem(key)) || [];
            break;
        default:
            value = localStorage.getItem(key);
            break;
    }
    return value;
}