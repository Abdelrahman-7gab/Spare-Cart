export interface ItemModel {
    id:string;
    name: string;
    photo: string | ArrayBuffer | null;
    price: number;
    servingSize: string;
    amountInStock: number;
    amountInCart: number;
}