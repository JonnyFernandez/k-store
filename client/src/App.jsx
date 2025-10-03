import AuthProvider from './context/AuthContext';
import ProdProvider from './context/ProdContext';
import {
  Register, Login, Home, Calculator, Butget, SalesReport, StockReport,
  Statistics, OrderDetail, AddProduct, Category, Distributor, Catalog,
  UpdateStock, ProdDetail, EditProd, UserManagement, Distributor_Category,
  LocalSale, OrderUpdate, ReportDetails
} from './pages/index';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { NavBar } from './components';
import './index.css'

function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/register"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && <NavBar />}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<LocalSale />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/butget" element={<Butget />} />
            <Route path="/prod" element={<AddProduct />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/stock-report" element={<StockReport />} />
            <Route path="/statistics-report" element={<Statistics />} />
            <Route path="/order-detail/:id" element={<OrderDetail />} />
            <Route path="/order-update/:id" element={<OrderUpdate />} />

            <Route path="/reportDetails" element={<ReportDetails />} />
            <Route path="/category" element={<Category />} />
            <Route path="/distributor" element={<Distributor />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/update-stock" element={<UpdateStock />} />
            <Route path="/detail/:id" element={<ProdDetail />} />
            <Route path="/prod-edit/:id" element={<EditProd />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/config/00649f28-94dd-412b-8c70-7687dc2fa087" element={<Distributor_Category />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProdProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ProdProvider>
    </AuthProvider>
  );
}

export default App;
