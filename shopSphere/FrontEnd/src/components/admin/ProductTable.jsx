import { Link } from "react-router-dom";
import { Trash2,Pencil } from "lucide-react";
import { useDispatch } from "react-redux";
import { getImageUrl } from "../../utils/imageUrl";
import {
removeProduct,
} from "../../features/admin/productSlice";

const ProductTable=({products})=>{

const dispatch=useDispatch();

return(

<div className="overflow-x-auto rounded-xl bg-white shadow">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">
Image
</th>

<th>Name</th>

<th>Price</th>

<th>Stock</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{products.map(product=>(

<tr
key={product._id}
className="border-t"
>

<td className="p-3">

<img
src={getImageUrl(product.images?.[0].url)}
className="h-16 w-16 rounded-lg object-cover"
/>

</td>

<td>

{product.name}

</td>

<td>

₹{product.price}

</td>

<td>

{product.stock}

</td>

<td>

{product.isActive?
"Active":"Disabled"}

</td>

<td>

<div className="flex gap-2">

<Link

to={`/admin/products/edit/${product._id}`}

className="rounded bg-blue-500 p-2 text-white"
>

<Pencil size={18}/>

</Link>

<button

onClick={()=>dispatch(removeProduct(product._id))}

className="rounded bg-red-500 p-2 text-white"
>

<Trash2 size={18}/>

</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

};

export default ProductTable;