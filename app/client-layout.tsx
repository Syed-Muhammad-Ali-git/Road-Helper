"use client";

/* ---------------- IMPORTS ---------------- */
import React, {
    ReactNode,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import store, { AppDispatch, RootState } from "@/redux/store";
import PathChecker from "./utils/pathChecker";
import { protectedRoutes } from "./utils/routes";
import { ToastContainer } from "react-toastify";
import { useLayout } from "./context/layoutContext";
import { Provider, useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { loginUser, logoutUser, setUserData, setLoading } from "@/redux/reducers/auth-reducer/auth-reducer";
import { Box, Center, Loader, Drawer, Stack, Text, Skeleton } from "@mantine/core";
import Sidebar from "@/components/sidebar/sidebar";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- INTERFACES ---------------- */
interface ClientLayoutProps {
    children: ReactNode;
}

/* ---------------- CONSTANTS ---------------- */
const drawerWidth = 280;

/* ---------------- COMPONENT ---------------- */
const ClientLayoutInner = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const { isLayoutVisible } = useLayout();
    const { loading, isAuthenticated, userData } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                dispatch(loginUser({ uid: firebaseUser.uid, email: firebaseUser.email }));

                try {
                    // Optimized fetching: check both possible roles if role not in metadata
                    const clientDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (clientDoc.exists()) {
                        dispatch(setUserData(clientDoc.data()));
                    } else {
                        const helperDoc = await getDoc(doc(db, "helpers", firebaseUser.uid));
                        if (helperDoc.exists()) {
                            dispatch(setUserData(helperDoc.data()));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                dispatch(logoutUser());
            }
            dispatch(setLoading(false));
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Close sidebar on mobile by default
    useEffect(() => {
        if (window.innerWidth < 768) {
            setDrawerOpen(false);
        }
    }, [pathname]);

    const showSidebar = useMemo(() => {
        if (!pathname || !isLayoutVisible) return false;
        return protectedRoutes.includes(pathname) || pathname === "/";
    }, [pathname, isLayoutVisible]);

    const mainStyle: React.CSSProperties = useMemo(
        () => ({
            transition: "padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            paddingLeft: showSidebar && drawerOpen && typeof window !== 'undefined' && window.innerWidth >= 768 ? `${drawerWidth}px` : "0",
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            width: "100%"
        }),
        [showSidebar, drawerOpen]
    );

    if (loading) {
        return (
            <Center className="h-screen bg-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Stack align="center" gap="md">
                        <Loader size="xl" variant="bars" color="blue" />
                        <Text fw={800} size="lg" className="tracking-tighter text-blue-600">ROAD HELPER</Text>
                    </Stack>
                </motion.div>
            </Center>
        );
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {showSidebar && (
                <Box
                    className="fixed left-0 top-[70px] bottom-0 z-[99] bg-white border-r hidden md:block transition-all duration-300"
                    style={{
                        width: drawerOpen ? drawerWidth : 0,
                        overflow: 'hidden',
                        opacity: drawerOpen ? 1 : 0
                    }}
                >
                    <Box style={{ width: drawerWidth }}>
                        <Sidebar />
                    </Box>
                </Box>
            )}

            {/* Mobile Sidebar */}
            <Drawer
                opened={showSidebar && drawerOpen && typeof window !== 'undefined' && window.innerWidth < 768}
                onClose={() => setDrawerOpen(false)}
                size={drawerWidth}
                withCloseButton={false}
                padding={0}
                hiddenFrom="md"
            >
                <Sidebar />
            </Drawer>

            <Box className="flex flex-col min-h-screen">
                {pathname && isLayoutVisible && (
                    <PathChecker
                        pathName={pathname}
                        open={drawerOpen}
                        setOpen={setDrawerOpen}
                    />
                )}
                <main style={mainStyle} className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-0"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </Box>
        </>
    );
};

const ClientLayout = ({ children }: ClientLayoutProps) => {
    return (
        <Provider store={store}>
            <ClientLayoutInner>{children}</ClientLayoutInner>
        </Provider>
    );
};

export default ClientLayout;
