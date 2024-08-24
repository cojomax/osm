import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

    private _app: any;
    private _auth: any;

    app() {
        return this._app;
    }

    auth() {
        return this._auth;
    }

    initializeApp() {

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAMLE6A1ZnV7_a3ihenc-CTXQRdXqMjTao",
            authDomain: "old-speckled-men.firebaseapp.com",
            projectId: "old-speckled-men",
            storageBucket: "old-speckled-men.appspot.com",
            messagingSenderId: "181570813115",
            appId: "1:181570813115:web:1e5306890828851d7b3d9e"
        };

        // Initialize Firebase
        this._app = initializeApp(firebaseConfig);
        // Initialize Firebase Authentication and get a reference to the service
        this._auth = getAuth(this._app);  
    }
}




