// page 1 : Products page
//To get all the products available
>>(Get) https://amazoncloneserver.herokuapp.com/products  (live link)
>>(Get) localhost:9100/items/products   (localhost link)
//To get products on basis of categories (category : watch, sub_category : analog watch)
>>(Get) https://amazoncloneserver.herokuapp.com/products_on_category_basis/?category=watches&sub_category=analog%20watch  (live link)
>>(Get) localhost:9100/products_on_category_basis/?category=watches&sub_category=analog watch (localhost link)
//To get products on basis of categories (category : jewellery) and price filter(increasing)
>>(Get) https://amazoncloneserver.herokuapp.com/category_and_filter/?category=jewellery&hcost=4500&lcost=500  (live link)
>>(Get) localhost:9100/category_and_filter/?category=jewellery&hcost=4500&lcost=500 (localhost link)
//To get products on the cart 
>>(Get) https://amazoncloneserver.herokuapp.com/cart (live link)
>>(Get) localhost:9100/cart  (localhost link)
//To get orders of the customers
>>(Get) https://amazoncloneserver.herokuapp.com/orderplaced  (live link)
>>(Get) localhost:9100/orderplaced  (localhost link)
//page 2 : listing page
//To get products details
>>(Get) https://amazoncloneserver.herokuapp.com/details/2 (live link)
>>(get) localhost:9100/details/2  (localhost link)
//page 3 : cart page
//To get products on the cart 
>>(Get) https://amazoncloneserver.herokuapp.com/cart (live link)
>>(Get) localhost:9100/cart  (localhost link) 
//Add to cart link with given cartId / productId / quantity
>>(Post) https://amazoncloneserver.herokuapp.com/addtocart/5/43/3 (live link)
>>(Post) localhost:9100/addtocart/5/33/2 (localhost link)
//page 4 : orderplaced page
//To get orderplaced data
>>(Get) https://amazoncloneserver.herokuapp.com/orderplaced  (live link)
>>(Get) localhost:9100/orderplaced  (localhost link)
//to cancel orders