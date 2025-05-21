import {customer_db, item_db, orders_db} from "../db/db.js";



    function loadSummaryTable(){

        $('#dashboard-table-tbody').empty();

        orders_db.map((item)=>{

            let orderId = item.orderId;
            let customerId = item.customId;
            let customerName = item.custom_name;
            let total = item.total;
            let date = item.date;

            let row = `<tr>
                              <td>${orderId}</td>
                              <td>${customerId}</td>
                              <td>${customerName}</td>
                              <td>${total}</td>
                              <td>${date}</td>
                              </tr>`

            $('#dashboard-table-tbody').append(row);

        })


    }


    function setDashboardCardValues(){

        let total_sales = 0 ;
        let orders_count = 0;
        let customer_count = 0;

        for (let i = 0; i < orders_db.length ; i++) {

            total_sales += orders_db[i].total;
            orders_count++;

        }

        for (let i = 0; i < customer_db.length; i++) {
            customer_count++
        }


        $('#total_sales').text(total_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        $('#orders_count').text(orders_count.toLocaleString());
        $('#customer_count').text(customer_count.toLocaleString());


    }



    $('#homeButton').on('click', function(){

        loadSummaryTable()
        setDashboardCardValues();

    })
