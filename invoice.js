/* ==========================================================================
   GreenLeaf Organics - Tax Invoice Generator (invoice.js)
   ========================================================================== */

window.generateAndPrintInvoice = function(orderId) {
  const order = window.db.getOrderById(orderId);
  if (!order) {
    showToast("Order not found for invoice generation.");
    return;
  }

  const invoiceNum = 'INV-' + order.order_number.replace('GLO-', '');
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tax Invoice - ${order.order_number}</title>
      <style>
        body { font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1c2d22; background: #fff; }
        .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #d1e3d6; padding: 30px; border-radius: 8px; }
        .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0b572a; padding-bottom: 20px; margin-bottom: 20px; }
        .logo-title { font-size: 24px; font-weight: bold; color: #0b572a; display: flex; align-items: center; gap: 10px; }
        .inv-title { font-size: 28px; font-weight: bold; color: #0b572a; text-align: right; }
        .inv-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .box { background: #f4f8f5; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.6; }
        .box h4 { margin: 0 0 8px 0; color: #0b572a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
        th { background: #0b572a; color: #fff; text-align: left; padding: 10px; }
        td { padding: 12px 10px; border-bottom: 1px solid #e1e8e2; }
        .totals-table { width: 300px; margin-left: auto; font-size: 14px; }
        .totals-table td { padding: 6px 10px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #0b572a; border-top: 2px solid #0b572a; }
        .print-btn { background: #0b572a; color: #fff; border: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
      </style>
    </head>
    <body>
      <div style="text-align: right;">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF Invoice</button>
      </div>

      <div class="invoice-container">
        <div class="invoice-header">
          <div class="logo-title">
            🌿 GreenLeaf Organics
          </div>
          <div>
            <div class="inv-title">TAX INVOICE</div>
            <div style="font-size: 13px; color: #666; text-align: right;">Invoice No: <strong>${invoiceNum}</strong></div>
          </div>
        </div>

        <div class="inv-details">
          <div class="box">
            <h4>Billed & Shipped By:</h4>
            <strong>GreenLeaf Organics</strong><br>
            Tamil Nadu, India, Pin - 626101<br>
            Phone: +91 96263 88886<br>
            Email: support@greenleaforganics.com<br>
            GSTIN: 33AAAAA0000A1Z5
          </div>
          <div class="box">
            <h4>Customer Details:</h4>
            <strong>${order.customer_name}</strong><br>
            Email: ${order.customer_email}<br>
            Mobile: ${order.customer_mobile}<br>
            <strong>Delivery Address:</strong> ${order.delivery_address}<br>
            <strong>Order Date:</strong> ${formattedDate}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.product_name}</strong></td>
                <td>₹${item.unit_price}</td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">₹${item.total_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">₹${order.subtotal}</td>
          </tr>
          <tr>
            <td>Delivery Charge:</td>
            <td style="text-align: right;">${order.delivery_charge === 0 ? 'FREE' : '₹' + order.delivery_charge}</td>
          </tr>
          <tr>
            <td>GST (5% Included):</td>
            <td style="text-align: right;">₹${order.tax}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">₹${order.total_amount}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e8e2; font-size: 13px; color: #555; text-align: center;">
          <p>Payment Method: <strong>${order.payment_method}</strong> | Payment Status: <strong style="color: #28a745;">${order.payment_status}</strong></p>
          <p>Thank you for shopping with GreenLeaf Organics! For support, email support@greenleaforganics.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  win.document.write(invoiceHTML);
  win.document.close();
};
