"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { MantineProvider, createTheme } from "@mantine/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { setAuthUser, setUserData, setLoading } from "@/redux/reducers/auth-reducer/auth-slice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
    fontFamily: "Satoshi, sans-serif",
    primaryColor: "blue",
    components: {
        Button: {
            defaultProps: {
                radius: "md",
            },
        },
        TextInput: {
            defaultProps: {
                radius: "md",
            },
        },
    },
});

function AuthSync({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                dispatch(setAuthUser({ uid: firebaseUser.uid, email: firebaseUser.email }));

                // Try fetching from both collections
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

    return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthSync>
                <MantineProvider theme={theme}>
                    {children}
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </MantineProvider>
            </AuthSync>
        </Provider>
    );
}
