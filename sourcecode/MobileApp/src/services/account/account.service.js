import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { apiUrl } from "../../utils/environment";

export const login = (email, password) => {
    return fetch(`${apiUrl}/accounts/authenticate`, {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    }).then((res) => {
        return res.json();
    });
}

