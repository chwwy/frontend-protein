import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import DashboardView from "../views/DashboardView";
import PeminjamanRuanganView from "../views/PeminjamanRuanganView";
import PeminjamanBarangView from "../views/PeminjamanBarangView";
import LoginPageView from "../views/LoginPageView";
import AdminView from "../views/AdminView";
import PengembalianBarangView from "../views/PengembalianBarangView";
import ProtectedRoute from "../components/ProtectedRoute";

const ScrollWrapper = ({ children }) => (
    <>
      <ScrollToTop />
      {children}
    </>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ScrollWrapper>
                <LoginPageView />
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard",
        element: (
            <ScrollWrapper>
                <DashboardView />
            </ScrollWrapper>
        )
    },
    {
        path: "/peminjaman-ruangan",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <PeminjamanRuanganView />
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/peminjaman-barang",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <PeminjamanBarangView />
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard-admin",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <AdminView />
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/pengembalian-barang",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <PengembalianBarangView />
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
]);

export default router;