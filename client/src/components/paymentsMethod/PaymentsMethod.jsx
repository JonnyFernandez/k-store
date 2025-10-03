import { FaRegTrashAlt, FaMoneyBillWave, FaCreditCard, FaQrcode } from "react-icons/fa";
import styleM from './PaymentsMethod.module.css';

const PaymentMethod = ({ payment, setPayment }) => {
    // console.log(payment);

    const handlePaymentClick = (method) => {
        setPayment(method);
    };

    return (
        <div className={styleM.metodosPago}>
            <button className={styleM.efectivo} onClick={() => handlePaymentClick('cash')} >
                <FaMoneyBillWave className={styleM.icon} /> Efect
            </button>
            <button className={styleM.tarjeta} onClick={() => handlePaymentClick('card')} >
                <FaCreditCard className={styleM.icon} /> Tarj
            </button>
            <button className={styleM.transferencia} onClick={() => handlePaymentClick('electronic')} >
                <FaQrcode className={styleM.icon} /> T / QR
            </button>
        </div>
    )
}



export default PaymentMethod;