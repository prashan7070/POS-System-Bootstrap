export default class OrderModel {

    constructor(orderId ,date, customId, custom_name ,cartArray=[],total , discount ,cash , balance ) {

            this.orderId = orderId;
            this.date = date;
            this.customId = customId;
            this.custom_name = custom_name;
            this.cartArray = cartArray;
            this.total = total;
            this.discount = discount;
            this.cash = cash;
            this.balance = balance;

    }

}