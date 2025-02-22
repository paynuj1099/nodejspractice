class Order{
    constructor(id, Title, Quantity, Message, City){
        this.id = id;
        this.Title = Title;
        this.Quantity = Quantity;
        this.Message = Message;
        this.City = City;
    }
}

module.exports = Order;