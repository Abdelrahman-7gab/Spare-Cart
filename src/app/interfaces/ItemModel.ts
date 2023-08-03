export interface ItemModel {
    id:string;
    name: string;
    photo: string | ArrayBuffer | null | undefined;
    price: number;
    servingSize: string;
    amountInStock: number;
    amountInCart: number;
}

export interface CartInfoModel{
totalPrice:number;
cartSize:number;
}