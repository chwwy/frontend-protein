import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import DashboardView from "../views/DashboardView";
import PeminjamanRuanganView from "../views/PeminjamanRuanganView";
import PeminjamanBarangView from "../views/PeminjamanBarangView";
import LoginPageView from "../views/LoginPageView";
import AdminView from "../views/AdminView";
import PengembalianBarangView from "../views/PengembalianBarangView";
import ProtectedRoute from "../components/ProtectedRoute";
import ManageBarangView from "../views/ManageBarangView";
import ManageRuanganView from "../views/ManageRuanganView";
import ManageAdminView from "../views/ManageAdminView";
import LogBarangView from "../views/LogBarangView";
import LogRuanganView from "../views/LogRuanganView";
import JadwalRuanganView from "../views/JadwalRuanganView";


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
    {
        path: "/dashboard/manage-barang",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <ManageBarangView />
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard/manage-ruangan",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <ManageRuanganView/>
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard/manage-admin",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <ManageAdminView/>
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard/log-barang",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <LogBarangView/>
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/dashboard/log-ruangan",
        element: (
            <ScrollWrapper>
                <ProtectedRoute>
                    <LogRuanganView/>
                </ProtectedRoute>
            </ScrollWrapper>
        )
    },
    {
        path: "/jadwal-ruangan",
        element: (
            <ScrollWrapper>
                <JadwalRuanganView/>
            </ScrollWrapper>
        )
    },
]);

export default router;