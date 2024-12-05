import { createBrowserRouter } from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import DashboardView from "../views/DashboardView";
import PeminjamanRuanganView from "../views/PeminjamanRuanganView";
import PeminjamanBarangView from "../views/PeminjamanBarangView";

const ScrollWrapper = ({ children }) => (
    <>
      <ScrollToTop />
      {children}
    </>
);

const router = createBrowserRouter([
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
]);

export default router;