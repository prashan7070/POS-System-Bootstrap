import {item_db} from "../db/db.js"
import ItemModel from "../model/ItemModel.js"


function loadItems(){


    $('#item-table-tbody').empty();

    item_db.map(item => {

        let itemId = item.itemId;
        let item_name = item.item_name;
        let qty = item.qty;
        let unitPrice = item.unitPrice;
        let discount = item.discount;

        let data = `<tr>
                           <td>${itemId}</td> 
                           <td>${item_name}</td>
                           <td>${qty}</td>
                           <td>${unitPrice}</td>
                           <td>${discount}</td>
                           </tr>`

        $('#item-table-tbody').append(data);

    });

}


$('#item-save').on('click', function(){

    let itemId = $('#itemId').val();
    let item_name = $('#item_name').val();
    let qty = $('#qty').val();
    let unitPrice = $('#unitPrice').val();
    let discount = $('#discount').val() ||0;
    let isExistsItem = item_db.some(i => i.itemId === itemId);

    if (itemId==='' || item_name==='' || qty==='' || unitPrice==='' || isExistsItem){

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    }else {

        let item_data = new ItemModel( itemId , item_name , qty , unitPrice ,discount);
        item_db.push(item_data);

        loadItems();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        $('#itemId').val('');
        $('#item_name').val('');
        $('#qty').val('');
        $('#unitPrice').val('');
        $('#discount').val('');

    }

})


$('#item-delete').on('click', function(){

    let itemId = $('#itemId').val();

    if (itemId===''){
        Swal.fire({
            title: 'Error!',
            text: 'please select item',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let index = item_db.findIndex(item => item.itemId===itemId)

        if (index<0){

            Swal.fire({
                title: 'Error!',
                text: 'Item not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

        }else {

            item_db.splice(index,1);
            console.log(item_db);

            loadItems();

            $('#itemId').val('');
            $('#item_name').val('');
            $('#qty').val('');
            $('#unitPrice').val('');
            $('#discount').val('');


            Swal.fire({
                title: "deleted Successfully!",
                icon: "success",
                draggable: true
            });

        }

    }

})


$('#item-table-tbody').on('click','tr',function(){

    let index = $(this).index();
    let obj = item_db[index];

    let itemId = obj.itemId;
    let item_name = obj.item_name;
    let qty = obj.qty;
    let unitPrice = obj.unitPrice;
    let discount = obj.discount;

    $('#itemId').val(itemId);
    $('#item_name').val(item_name);
    $('#qty').val(qty);
    $('#unitPrice').val(unitPrice);
    $('#discount').val(discount);



});


$('#item-update').on('click', function(){

    let itemId = $('#itemId').val();
    let item_name = $('#item_name').val();
    let qty = $('#qty').val();
    let unitPrice = $('#unitPrice').val();
    let discount = $('#discount').val() || 0;



    if (itemId==='' || item_name==='' || qty==='' || unitPrice===''){

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    }else {

        let index = item_db.findIndex(item => item.itemId===itemId);

        if (index<0){
            Swal.fire({
                title: 'Error!',
                text: 'Item not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

        } else {

            item_db[index] = {
                               itemId: itemId,
                               item_name: item_name,
                               qty: qty,
                               unitPrice: unitPrice,
                               discount: discount,

                             };

            console.log(item_db);
            loadItems();

            Swal.fire({
                title: "updated Successfully!",
                icon: "success",
                draggable: true
            });

        }

    }

})



$('#item-search').on('click',function(){

    let itemId = $('#input-itemId').val();

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

            let itemId = obj.itemId;
            let item_name = obj.item_name;
            let qty = obj.qty;
            let unitPrice = obj.unitPrice;
            let discount = obj.discount;

            $("#itemId").val(itemId);
            $("#item_name").val(item_name);
            $("#qty").val(qty);
            $("#unitPrice").val(unitPrice);
            $("#discount").val(discount);


        }

    }

})


$('#item-reset').on('click',function(){

    $("#itemId").val('');
    $("#item_name").val('');
    $("#qty").val('');
    $("#unitPrice").val('');
    $("#discount").val('');


})


