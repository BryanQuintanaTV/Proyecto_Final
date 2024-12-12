export interface Order {
    num_order: number;
    order_products: { 
        product_id: number,
        quantity: number,
    }[],
    total_order: number;
    date_order: string;

}