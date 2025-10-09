import { useState } from 'react'
import { Home, Catalog, AddProduct, SalesReport, StockReport, Statistics, UpdateStock, Users, Category, Distribuitor } from './views'
import { Route, Routes } from 'react-router-dom'
// import './App.css'

function App() {


  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path='/agregar-producto' element={<AddProduct />} />
        <Route path='/reporte-ventas' element={<SalesReport />} />
        <Route path='/reporte-stock' element={<StockReport />} />
        <Route path='/estadisticas' element={<Statistics />} />
        <Route path='/actualizar-stock' element={<UpdateStock />} />
        <Route path='/usuario' element={<Users />} />
        <Route path='/category' element={<Category />} />
        <Route path='/provider' element={<Distribuitor />} />

      </Routes>
    </>
  )
}

export default App
