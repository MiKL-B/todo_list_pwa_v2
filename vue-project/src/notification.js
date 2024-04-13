import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function notification(type,text) {
    let parameters = {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        theme: "colored",
    }
    switch (type) {
        case 'error':
            toast.error(text, parameters);
            break;
        case 'success':
            toast.success(text, parameters);
            break;
    }
}

