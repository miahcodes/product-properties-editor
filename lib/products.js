// lib/products.js

export async function getProductByHandle(handle) {
    // Replace this with your actual data fetching logic
    const products = [
        {
            handle: 'sample-product-1',
            properties: [
                { name: 'Color', value: 'red' },
                { name: 'Size', value: 'large' },
            ],
        },
        {
            handle: 'sample-product-2',
            properties: [
                { name: 'Material', value: 'wood' },
                { name: 'Dimensions', value: '120x80x60' },
            ],
        },
    ];

    return products.find((product) => product.handle === handle);
}
