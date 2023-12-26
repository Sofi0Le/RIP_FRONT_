import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {userSlice} from "UserSlice.ts";



export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/v3/users/login",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Добро пожаловать :)"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        dispatch(userSlice.actions.setRole(response.data.role ?? ''))
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            Cookies.set('role', response.data.role ?? '');
            dispatch(userSlice.actions.setAuthStatus(true));
            Cookies.set('userImage', response.data.userImage)
            Cookies.set('userName', response.data.userName)
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// MARK: - Mock data