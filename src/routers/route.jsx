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
                <PeminjamanRuanganView />
            </ScrollWrapper>
        )
    },
    {
        path: "/peminjaman-barang",
        element: (
            <ScrollWrapper>
                <PeminjamanBarangView />
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
                <PengembalianBarangView />
            </ScrollWrapper>
        )
    },
]);

export default router;