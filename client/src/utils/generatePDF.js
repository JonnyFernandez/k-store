import { jsPDF } from "jspdf";
import logo from '../assets/grillo_negro_final.png'
import qr from '../assets/qr_gn.png'

const generarPDF = (productos, client, currentDate) => {
    const formatDate = (date) => {
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        }
        return new Date(date).toLocaleDateString("es-AR");
    };

    const fecha = currentDate ? currentDate : formatDate(new Date());
    let nombreArchivo = client.name ? `${client.name.split(" ")[0]} - ${fecha}` : `Nota-entrega - ${fecha}`;
    const doc = new jsPDF();

    // --- Logo e info empresa
    doc.addImage(logo, "PNG", 20, -10, 80, 80);
    const infoX = 140;
    let infoY = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Distribuidora Grillo Negro", infoX, infoY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    infoY += 8;
    doc.text("Dirección: Calle 44 Nº5215, La Plata", infoX, infoY);
    infoY += 6;
    doc.text("WhatsApp: 221-488-4996", infoX, infoY); // número actualizado
    infoY += 6;
    doc.text("sitio-web: grillonegro.com.ar", infoX, infoY);
    infoY += 6;
    doc.text(`Fecha: ${fecha}`, infoX, infoY);

    // --- Línea separadora
    doc.setDrawColor(100);
    doc.line(20, 55, 200, 55);

    // --- Datos del Cliente
    let y = 60;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Datos del Cliente", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y += 6;
    doc.text(`Nombre/Razón Social: ${client?.name || '---'}`, 20, y);
    y += 6;
    doc.text(`CUIT/DNI: ${client?.cuit || '---'}`, 20, y);
    y += 6;
    doc.text(`Teléfono: ${client?.phone || '---'}`, 20, y);
    y += 6;
    doc.text(`Observaciones: ${client?.review || '---'}`, 20, y);

    // --- Tabla de productos
    y += 10;
    doc.setFillColor(0, 0, 0);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Código", 22, y + 6);
    doc.text("Producto", 45, y + 6);
    doc.text("Cantidad", 110, y + 6);
    doc.text("Precio Unit.", 135, y + 6);
    doc.text("Subtotal", 165, y + 6);

    // --- Detalle productos
    y += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    let totalCompra = 0;

    productos.forEach(prod => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const codigo = prod.code?.slice(-4) || "----";
        const producto = prod.name || "Sin nombre";
        const cantidad = Number(prod.quantity) || 1;
        const precio = Number(prod.price) || 0;
        const total = cantidad * precio;
        totalCompra += total;

        doc.setFontSize(9);
        doc.text(codigo, 22, y);
        doc.text(producto.length > 35 ? producto.substring(0, 35) + "..." : producto, 45, y);
        doc.text(cantidad.toString(), 110, y);
        doc.text(`$${precio.toFixed(2)}`, 135, y);
        doc.text(`$${total.toFixed(2)}`, 165, y);
        y += 6;
    });

    // --- Total
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text(
        `TOTAL: ${totalCompra.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ARS`,
        145,
        y
    );

    // --- Nota legal
    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(
        "Este comprobante no es una factura. Se emite como constancia de entrega o presupuesto.",
        20,
        y
    );

    // --- Invitación final a la web
    if (y > 240) {
        doc.addPage();
        y = 20;
    }

    let finalY = y + 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("¡Gracias por confiar en Distribuidora Grillo Negro!", 20, finalY);

    finalY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Visitanos en nuestra web para ver más productos y hacer tu pedido:", 20, finalY);

    finalY += 6;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink("grillonegro.com.ar", 20, finalY, { url: "https://www.grillonegro.com.ar" });
    doc.setTextColor(0, 0, 0);

    // --- Pie de página con QR ---
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const qrSize = 35; // tamaño coqueto
    const margin = 20;

    // Colocamos el QR abajo a la derecha
    doc.addImage(qr, "PNG", pageWidth - qrSize - margin, pageHeight - qrSize - margin, qrSize, qrSize);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    // Texto al pie, alineado a la izquierda
    doc.text("Escaneá el QR para visitar nuestra web o hacer tu pedido por WhatsApp", 20, pageHeight - 15);


    // --- Guardar PDF
    doc.save(`${nombreArchivo}.pdf`);
};

export default generarPDF;
