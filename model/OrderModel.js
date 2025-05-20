export default class OrderModel {

    constructor(orderId ,date, customId, custom_name , ItemId , Item_name , qty , total , discount ,cash , balance ) {

            this.orderId = orderId;
            this.date = date;
            this.customId = customId;
            this.custom_name = custom_name;
            this.itemId = itemId;
            this.item_name = item_name;
            this.qty = qty;
            this.total = total;
            this.discount = discount;
            this.cash = cash;
            this.balance = balance;


    }


}