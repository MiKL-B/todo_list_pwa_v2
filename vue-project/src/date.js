export function getCurrentDate() {
    let currentTime = new Date().toLocaleTimeString();
    let currentDay = new Date().toLocaleDateString();
    let date = currentDay + " - " + currentTime;
    return date;
}


export function getDate() {
    var date = new Date().toISOString().slice(0, 10);
    return date;
}