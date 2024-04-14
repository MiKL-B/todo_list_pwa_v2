let colors = ['primary', 'success', 'danger', 'warning', 'epic', 'legendary','pink'];
export function getRandomColor(){
    let index = Math.floor(Math.random() * colors.length);
    let random = colors[index];
    return random;
}