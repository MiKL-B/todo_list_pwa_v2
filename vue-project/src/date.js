export function getCurrentDate() {
    let currentTime = new Date().toLocaleTimeString();
    let currentDay = new Date().toLocaleDateString();
    let date = currentDay + " - " + currentTime;
    return date;
}