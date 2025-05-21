import {customer_db, item_db, orders_db} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";


$(document).ready(function(){

    let date = new Date().toISOString().split('T')[0];
    $('#order_date').val(date);

})


//customer search
$('#order-search-customer').on('click',function(){

    let customId = $('#input-order-customId').val();

    if (customId===''){

        Swal.fire({
            title: 'Error!',
            text: 'Enter correct customer Id',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let index = customer_db.findIndex(customer => customer.customId === customId);
        console.log(index);

        if (index<0) {

            Swal.fire({
                title: 'Error!',
                text: 'customer not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

            $('#input-order-customId').val('');


        }else {

            let obj = customer_db[index];
            console.log(obj);

            let custom_name = obj.custom_name;

            $("#input-order-custom_name").val(custom_name);



        }

    }

})


//item search
$('#order-item-search').on('click',function(){

    let itemId = $('#input-order-itemId').val();

    if (itemId===''){

        Swal.fire({
            title: 'Error!',
            text: 'Enter correct item Id',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let index = item_db.findIndex(item => item.itemId === itemId);
        console.log(index);

        if (index<0) {

            Swal.fire({
                title: 'Error!',
                text: 'item not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })


        }else {

            let obj = item_db[index];
            console.log(obj);

            let item_name = obj.item_name;
            let qoh = obj.qty;
            let unitPrice = obj.unitPrice;
            let discount = obj.discount;


            $("#input-order-item_name").val(item_name);
            $("#input-order-unitPrice").val(unitPrice);
            $("#input-order-qoh").val(qoh);
            $("#input-discount").val(discount);



        }

    }

})


let cartArray = [];
let subTotal = 0;
let subDiscount = 0;
let amountPayed = 0;
let balance = 0 ;

$('#order-addToCart').on('click',function(){

        let itemId = $('#input-order-itemId').val();
        let item_name = $('#input-order-item_name').val();
        let unitPrice = parseFloat($('#input-order-unitPrice').val()) || 0;
        let qty = parseInt($('#input-order-qty').val()) || 0;
        let discount = parseInt($('#input-discount').val()) || 0;
        let qoh = parseInt($('#input-order-qoh').val()) || 0;


        if (itemId ==='' || qty === 0 || qty > qoh || cartArray.some(i => i.itemId === itemId)){

            Swal.fire({
                title: 'Error!',
                text: 'Invalid Inputs',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

        }else{

                let itemTotal = 0;

                if (discount>0){
                    itemTotal = (unitPrice - discount) * qty;
                    subDiscount+= discount*qty;
                }else {
                    itemTotal = unitPrice* qty;
                }

                subTotal+=itemTotal;
                console.log(subTotal);
                console.log(subDiscount);

                let cartData = {itemId:itemId,item_name:item_name,unitPrice:unitPrice,discount:discount,qty:qty,itemTotal:itemTotal};

                cartArray.push(cartData);
                console.log(cartArray);

                let cartRow = `<tr data-item-id="${itemId}">
                                    <td>${itemId}</td>
                                    <td>${item_name}</td>
                                    <td>${unitPrice}</td>
                                    <td>${discount}</td>
                                    <td>${qty}</td>
                                    <td>${itemTotal}</td>
                                    <td><button id="button-addtocart-delete" class="btn btn-danger btn-sm delete-cart-item">Delete</button></td>
                                  </tr>`

                $('#cart-table-tbody').append(cartRow);

                updateOrderDashboard(subTotal,subDiscount, amountPayed ,balance );

                $('#input-order-itemId').val('');
                $('#input-order-item_name').val('');
                $('#input-order-unitPrice').val('');
                $('#input-order-qty').val('');
                $('#input-discount').val('');
                $('#input-order-qoh').val('');


        }

});


$('#cart-table-tbody').on('click','.delete-cart-item',function(){

            let $row = $(this).closest('tr');
            let itemId = $row.data('item-id');

            let index = cartArray.findIndex(item => item.itemId === itemId);
            let itemTotal = cartArray[index].itemTotal;
            let discount = cartArray[index].discount;
            let qty = cartArray[index].qty;

            if (discount>0){
                subDiscount -= (discount*qty);
            }

            subTotal -= itemTotal;
            console.log(subTotal);
            console.log(subDiscount);

            cartArray = cartArray.filter(item => item.itemId !== itemId);

            $row.remove();

            updateOrderDashboard(subTotal,subDiscount, amountPayed ,balance );


            Swal.fire({
                title: 'Item Removed!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });


});


function updateOrderDashboard(subTotal,subDiscount, amountPayed ,balance ){

            $('#subTotal').text(subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#subDiscount').text(subDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#amountPayed').text(amountPayed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#balance').text(balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

}


$('#placeOrder').on('click',function(){

            let customId = $('#input-order-customId').val();
            let cash = parseFloat($('#cashPayment').val()) || 0;
            let orderDate = $('#order_date').val();
            let orderId = $('#orderId').val();

            let isExistsOrder = orders_db.some(o=>o.orderId === orderId);

            if ((cash<=0) || (cash<subTotal) || (cartArray.length===0)  || customId==='' || orderId==='' || isExistsOrder){

                Swal.fire({
                    title: 'Error!',
                    text: 'Some details are missing or incorrect',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })


            }else {

                amountPayed = cash;
                let customer = customer_db.find(c=> c.customId === customId);
                let customerName = customer.custom_name;

                let data = new OrderModel(orderId,orderDate,customId,customerName,cartArray , subTotal , subDiscount ,amountPayed ,balance);

                orders_db.push(data);

                for (let i = 0; i < cartArray.length; i++) {

                    if (cartArray[i].itemId === item_db[i].itemId){

                        let preQty = item_db[i].qty;
                        let orderQty = cartArray[i].qty;
                        item_db[i].qty = preQty - orderQty;

                        console.log(item_db[i]);

                    }


                }

                balance = amountPayed - subTotal;
                console.log(balance);


                // Generate Invoice
                let invoiceHtml = `
            <h2>Invoice</h2>
            <p>Order ID: ${orderId}</p>
            <p>Customer: ${customerName} (${customId})</p>
            <p>Date: ${orderDate}</p>
            <table>
                <tr><th>Item</th><th>Qty</th><th>Total (Rs)</th></tr>
                ${cartArray.map(item => `<tr><td>${item.item_name}</td><td>${item.qty}</td><td>${item.itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>`).join('')}
            </table>
            <p>Sub Total: Rs. ${subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Discount: Rs. ${subDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Payment: Cash Rs. ${amountPayed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Balance: Rs. ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        `;
                localStorage.setItem('invoice', invoiceHtml);


                updateOrderDashboard(subTotal,subDiscount, amountPayed ,balance);

                refreshItemTable();

                Swal.fire({
                    title: "<strong>Order Success!</strong>",
                    icon: "success",
                    html: `OrderId : <b>${orderId}</b><br>Cash : <b>${amountPayed}</b><br> Balance : <b>${balance}</b><br> Discount : <b>${subDiscount}`,
                    showCloseButton: true,
                    // showCancelButton: true,
                    focusConfirm: true,
                    confirmButtonText: `<i class="fa fa-thumbs-up"></i> Done`,
                    confirmButtonAriaLabel: "Thumbs up, great!",
                    // cancelButtonText: `<i class="fa fa-thumbs-down"></i>`,
                    // cancelButtonAriaLabel: "Thumbs down"
                });


                clearFields();

            }


})


function refreshItemTable(){

    $('#item-table-tbody').empty();

    item_db.map(item => {

        let itemId = item.itemId;
        let item_name = item.item_name;
        let qty = item.qty;
        let unitPrice = item.unitPrice;

        let data = `<tr>
                           <td>${itemId}</td> 
                           <td>${item_name}</td>
                           <td>${qty}</td>
                           <td>${unitPrice}</td>
                           </tr>`

        $('#item-table-tbody').append(data);

    });

}


function clearFields(){

    $('#cart-table-tbody').empty();

    $('#input-order-customId').val('');
    $("#input-order-custom_name").val('');
    $('#orderId').val('');

    $('#subTotal').text('');
    $('#subDiscount').text('');
    $('#amountPayed').text('');
    $('#balance').text('');

    $('#cashPayment').val('')

    cartArray = [];
    subTotal = 0;
    subDiscount = 0;
    amountPayed = 0;
    balance = 0 ;


}



// Generate Report
$('#generateReport').on('click', function() {
    let reportHtml = "<h3>Order Summary</h3><ul>";
    orders_db.forEach(order => {
        reportHtml += `<li>Order ID: ${order.orderId}, Customer: ${order.customId} (${order.custom_name}), Total: Rs. ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>`;
        order.cartArray.forEach(item => {
            reportHtml += `<ul><li>Item: ${item.item_name}, Qty: ${item.qty}, Total: Rs. ${item.itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li></ul>`;
        });
    });
    reportHtml += "</ul>";

    $('#reportContent').html(reportHtml);
    $('#reportModal').css('display', 'flex');


    $('.close').on('click', function() {
        $('#reportModal').css('display', 'none');
    });


    $('#downloadPdf').on('click', function() {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        doc.text(reportHtml.replace(/<[^>]+>/g, ''), 10, 10); // Remove HTML tags for PDF
        doc.save('order_report.pdf');
    });

    /
    $('#printReport').on('click', function() {
        let printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Order Report</title></head><body>');
        printWindow.document.write(reportHtml);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });
});



// Print Invoice
$('#printInvoice').on('click', function() {
    let invoiceHtml = localStorage.getItem('invoice');
    let printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write('<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 8px; }</style>');
    printWindow.document.write(invoiceHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    $('#printInvoice').css('display', 'none'); // Hide after print
});









