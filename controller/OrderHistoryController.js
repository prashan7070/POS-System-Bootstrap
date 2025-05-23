import {orders_db} from "../db/db.js";



$('#orderHistory-search').on('click', function(){

    let orderId = $('#input-orderHistorySearch').val();

    if(orderId === ''){

        Swal.fire({
            title: 'Error!',
            text: 'Please enter an orderiD',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

        $('#input-orderHistorySearch').val('');

        return;

    }

    if(!orders_db.some(i => i.orderId === orderId)){

        Swal.fire({
            title: 'Error!',
            text: 'Order Id not found',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

        $('#input-orderHistorySearch').val('');

        return;

    }


    $('#orderHistory-table-tbody').empty();


    let orderObj = orders_db.find(i => i.orderId === orderId);

    let order_Id = orderObj.orderId;
    let date = orderObj.date;
    let customId = orderObj.customId;
    let custom_name = orderObj.custom_name;
    let total = orderObj.total;
    let discount = orderObj.discount;

    let data = `<tr>
                                <td>${order_Id}</td>
                                <td>${date}</td>
                                <td>${customId}</td>
                                <td>${custom_name}</td>
                                <td>${total}</td>
                                <td>${discount}</td>
                                </tr>`

    $('#orderHistory-table-tbody').append(data);

    loadItemDetailsTable(orderId);



})



function loadItemDetailsTable(orderId){

    $('#orderDetails-table-tbody').empty();

    let orderObj = orders_db.find(i => i.orderId === orderId);
    let itemArr = orderObj.cartArray;

    itemArr.map((item)=>{

        let itemId = item.itemId;
        let itemName = item.item_name;
        let unitPrice = item.unitPrice;
        let discount = item.discount;
        let qty = item.qty;
        let itemTotal = item.itemTotal;

        let data = `<tr>
                                <td>${itemId}</td>
                                <td>${itemName}</td>
                                <td>${unitPrice}</td>
                                <td>${discount}</td>
                                <td>${qty}</td>
                                <td>${itemTotal}</td>
                                </tr>`

        $('#orderDetails-table-tbody').append(data);

    })



}










function loadOrderHistoryTable(){

    $('#orderHistory-table-tbody').empty();

    orders_db.map((item)=>{

        let orderId = item.orderId;
        let date = item.date;
        let customId = item.customId;
        let customName = item.custom_name;
        let total = item.total;
        let discount = item.discount;

        let data = `<tr>
                                <td>${orderId}</td>
                                <td>${date}</td>
                                <td>${customId}</td>
                                <td>${customName}</td>
                                <td>${total}</td>
                                <td>${discount}</td>
                                </tr>`

        $('#orderHistory-table-tbody').append(data);

    })


}


$('#orderHistory-reset').on('click', function(){

    $('#input-orderHistorySearch').val('');
    loadOrderHistoryTable();
    $('#orderDetails-table-tbody').empty();




})


$('#btnOrderHistory').on('click', function(){

    loadOrderHistoryTable();

})



