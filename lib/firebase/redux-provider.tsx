"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";
import { setAuthUser, setUserData, setLoading } from "@/redux/reducers/auth-reducer/auth-slice";
import { useDispatch } from "react-redux";

function AuthSync() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                dispatch(setAuthUser({ uid: firebaseUser.uid, email: firebaseUser.email }));

                // Fetch user data from Firestore
                const clientDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (clientDoc.exists()) {
                    dispatch(setUserData(clientDoc.data() as any));
                } else {
                    const helperDoc = await getDoc(doc(db, "helpers", firebaseUser.uid));
                    if (helperDoc.exists()) {
                        dispatch(setUserData(helperDoc.data() as any));
                    } else {
                        dispatch(setUserData(null));
                    }
                }
            } else {
                dispatch(setAuthUser(null));
            }
            dispatch(setLoading(false));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthSync />
            {children}
        </Provider>
    );
}
