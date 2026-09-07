import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";

import { fetchProducts } from "../../features/admin/productSlice";

import ProductTable from "../../components/admin/ProductTable";

const Products=()=>{

const dispatch=useDispatch();

const{
products,
loading,
}=useSelector(
state=>state.productsAdmin
);

useEffect(()=>{

dispatch(fetchProducts());

},[dispatch]);

return(

<div className="space-y-6">

<div className="flex items-center justify-between">

<h1 className="text-3xl font-bold">

Products

</h1>

<Link

to="/admin/products/new"

className="rounded-lg bg-blue-600 px-5 py-3 text-white"

>

+ Add Product

</Link>

</div>

{loading?

<p>

Loading...

</p>

:

<ProductTable
products={products}
/>

}

</div>

);

};

export default Products;