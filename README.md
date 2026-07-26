# PRODUCT UPDATES — START HERE

This folder contains everything needed for routine product updates.

Do not edit the main website files unless you are changing the website design.

## Main Product File

All product information is stored here:

`00_PRODUCT_UPDATES_HERE/products.json`

Edit that file when you need to:

- Add a product
- Change a product name
- Change a price
- Change a description
- Change a category
- Change a product size
- Mark a product in stock or out of stock
- Change a product image
- Add or replace a product document

## Product Images

Upload product photos into:

`00_PRODUCT_UPDATES_HERE/product-images/`

Use simple lowercase file names with hyphens.

Example:

`formula-alpha.jpg`

Do not use spaces in file names.

## Product Documents

Upload COAs, testing documents, specification sheets, or other product documents into:

`00_PRODUCT_UPDATES_HERE/product-documents/`

Example:

`formula-alpha-coa.pdf`

## Example Product Entry

Each product in `products.json` should look similar to this:

```json
{
  "id": "formula-alpha",
  "name": "Formula Alpha",
  "category": "Peptides",
  "price": 59,
  "size": "10 mg",
  "format": "Vial",
  "image": "00_PRODUCT_UPDATES_HERE/product-images/formula-alpha.jpg",
  "description": "Product description goes here.",
  "document": "00_PRODUCT_UPDATES_HERE/product-documents/formula-alpha-coa.pdf",
  "inStock": true,
  "featured": false
}
