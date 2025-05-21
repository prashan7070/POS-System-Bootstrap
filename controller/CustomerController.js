import {customer_db} from "../db/db.js"
import CustomerModel from "../model/CustomerModel.js"

function loadCustomer(){

        $('#cust-table-tbody').empty();
        customer_db.map((item,index)=>{

            let customId = item.customId;
            let custom_name = item.custom_name;
            let address = item.address;
            let phone = item.phone;

            let data = `<tr>
                                <td>${customId}</td>
                                <td>${custom_name}</td>
                                <td>${address}</td>
                                <td>${phone}</td>
                                </tr>`

            $('#cust-table-tbody').append(data);

        })


}


$("#customer-save").on('click',function(){

    let customId = $('#cust_id').val();
    let custom_name = $('#cust_name').val();
    let address = $('#address').val();
    let phone = $('#mobile').val();
    let isExistCustomer = customer_db.some(c=> c.customId === customId);


    if (customId==='' || custom_name==='' || address==='' || phone==='' || isExistCustomer){

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let customer_data = new CustomerModel(customId , custom_name ,address ,phone);
        customer_db.push(customer_data);

        loadCustomer();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        $('#cust_id').val('');
        $('#cust_name').val('');
        $('#address').val('');
        $('#mobile').val('');

    }

})


$("#cust-table-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    console.log(idx);
    let obj = customer_db[idx];
    console.log(obj);

    let customId = obj.customId;
    let custom_name = obj.custom_name;
    let address = obj.address;
    let phone = obj.phone;

    $("#cust_id").val(customId);
    $("#cust_name").val(custom_name);
    $("#address").val(address);
    $("#mobile").val(phone);
});



$('#customer-delete').on('click',function(){

    let customId = $('#cust_id').val();


    if (customId===''){

        Swal.fire({
            title: 'Error!',
            text: 'please select customer',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let index = customer_db.findIndex(customer => customer.customId === customId);

        if (index<0){

            Swal.fire({
                title: 'Error!',
                text: 'customer not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

        } else {

            customer_db.splice(index,1);
            console.log(customer_db)
            loadCustomer();

            $('#cust_id').val('');
            $('#cust_name').val('');
            $('#address').val('');
            $('#mobile').val('');

            Swal.fire({
                title: "deleted Successfully!",
                icon: "success",
                draggable: true
            });

        }


    }


})


$('#customer-update').on('click',function(){

    let custom_Id = $('#cust_id').val();
    let customer_name =  $('#cust_name').val();
    let address =  $('#address').val();
    let phoneNum = $('#mobile').val();

    if (custom_Id==='' || customer_name==='' || address==='' || phoneNum===''){

        Swal.fire({
            title: 'Error!',
            text: 'select customer',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    } else {

        let index = customer_db.findIndex(customer => customer.customId === custom_Id);
        console.log(index);

        if (index<0) {

            Swal.fire({
                title: 'Error!',
                text: 'customer not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            })

        }else {

            customer_db[index] = {customId:custom_Id, custom_name:customer_name ,address:address , phone:phoneNum};

            console.log(customer_db);

            loadCustomer();

            $('#cust_id').val('');
            $('#cust_name').val('');
            $('#address').val('');
            $('#mobile').val('');

            Swal.fire({
                title: "updated Successfully!",
                icon: "success",
                draggable: true
            });


        }

    }

})


$('#customer-search').on('click',function(){

    let customId = $('#input-customId').val();

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

            let customId = obj.customId;
            let custom_name = obj.custom_name;
            let address = obj.address;
            let phone = obj.phone;

            $("#cust_id").val(customId);
            $("#cust_name").val(custom_name);
            $("#address").val(address);
            $("#mobile").val(phone);


        }

    }

})


$('#customer-reset').on('click',function(){

    $('#cust_id').val('');
    $('#cust_name').val('');
    $('#address').val('');
    $('#mobile').val('');


})