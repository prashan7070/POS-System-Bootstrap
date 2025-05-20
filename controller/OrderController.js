import {customer_db , item_db , orders_db , order_details} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

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


            $("#input-order-item_name").val(item_name);
            $("#input-order-unitPrice").val(unitPrice);
            $("#input-order-qoh").val(qoh);



        }

    }

})


let cartArray = [];
let subTotal = 0;
let subDiscount = 0;

$('#order-addToCart').on('click',function(){

        let itemId = $('#input-order-itemId').val();
        let item_name = $('#input-order-item_name').val();
        let unitPrice = parseFloat($('#input-order-unitPrice').val());
        let qty = parseInt($('#input-order-qty').val());
        let discount = parseInt($('#input-discount').val());
        let qoh = parseInt($('#input-order-qoh').val())


        if (itemId ==='' || qty === 0 || qty > qoh ){

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
            subDiscount -= discount*qty;
            subTotal -= itemTotal;
            console.log(subTotal);
            console.log(subDiscount);

            cartArray = cartArray.filter(item => item.itemId !== itemId);

            $row.remove();


            Swal.fire({
                title: 'Item Removed!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });


});