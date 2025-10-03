import { useEffect, useState } from 'react';
import { useProd } from '../context/ProdContext';
import Swal from 'sweetalert2';
import moment from 'moment';

const useOrders = (navigate) => {
    const { errors, getOrders, orders, getOrdersByDates } = useProd()
    const allOrders = orders
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [startDate, setStart] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const formattedStartDate = moment(startDate).format("DD/MM/YYYY");
    const formattedEndDate = moment(endDate).format("DD/MM/YYYY");




    const [paymentFilter, setPaymentFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await getOrdersByDates(formattedStartDate, formattedEndDate);
            } catch (error) {
                console.error('Error fetching orders:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: error.response?.data?.message || 'Error desconocido',
                    footer: 'Soporte técnico: arcancode@gmail.com',
                });
            }
        };
        fetchOrders();
    }, [navigate]);

    const filteredOrders = allOrders?.orders
        ?.filter((order) => order.date === selectedDate)
        .filter((order) => {
            if (paymentFilter === 'cash') return order.payment_method === 'cash';
            if (paymentFilter === 'electronic') return order.payment_method === 'electronic';
            if (paymentFilter === 'account1') return order.user === 'dorca';
            if (paymentFilter === 'account2') return order.user === 'jonny';
            return true;
        });

    return { filteredOrders, selectedDate, setSelectedDate, paymentFilter, setPaymentFilter };
};

export default useOrders;