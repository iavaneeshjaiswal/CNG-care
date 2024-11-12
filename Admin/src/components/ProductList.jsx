import React, { useEffect, useState } from "react";

export default function ProductList() {
  const products = [
    {
      category: "Electronics",
      title: "Wireless Bluetooth Headphones",
      price: 99.99,
      offerPrice: 79.99,
      quantity: 50,
      description:
        "High-quality wireless Bluetooth headphones with noise-cancellation and long battery life.",
      image:
        "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      category: "Electronics",
      title: "Smartphone 5G",
      price: 799.99,
      offerPrice: 749.99,
      quantity: 120,
      description:
        "Latest 5G-enabled smartphone with a 6.5-inch AMOLED display and 128GB storage.",
      image:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
    {
      category: "Home Appliances",
      title: "Air Purifier",
      price: 149.99,
      offerPrice: 129.99,
      quantity: 30,
      description:
        "Compact air purifier with HEPA filtration for cleaner air and a healthier home.",
      image:
        "https://img.freepik.com/free-vector/white-product-podium-with-green-tropical-palm-leaves-golden-round-arch-green-wall_87521-3023.jpg",
    },
    {
      category: "Books",
      title: "The Great Gatsby",
      price: 14.99,
      offerPrice: 9.99,
      quantity: 200,
      description:
        "A classic novel by F. Scott Fitzgerald, exploring themes of wealth, class, and the American Dream.",
      image:
        "https://img.freepik.com/premium-photo/ultra-realistic-orange-background-4k-hd-photo-product_1193781-21514.jpg",
    },
    {
      category: "Fashion",
      title: "Leather Jacket",
      price: 199.99,
      offerPrice: 169.99,
      quantity: 75,
      description:
        "Stylish and durable leather jacket with a slim fit design, perfect for casual or semi-formal occasions.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      category: "Sports & Outdoors",
      title: "Yoga Mat",
      price: 29.99,
      offerPrice: 24.99,
      quantity: 150,
      description:
        "Non-slip, eco-friendly yoga mat designed for comfort and stability during your practice.",
      image:
        "https://img.freepik.com/free-photo/3d-cartoon-beauty-products_23-2151503319.jpg",
    },
  ];

  const [allproducts, setAllproducts] = useState({ ...products });
  // const fetchInfo=async()=>{
  //   await fetch('http://localhost:4000/allproducts').then((res)=>res.json()).then
  //   ((data)=>
  //     {setAllproducts(data)});
  // }

  // useEffect(
  //   ()=>{
  //     fetchInfo();
  //   },[]
  // )

  // const remove_product=async(id)=>{
  //   await fetch('http://localhost:4000/removeproduct',{
  //     method:'POST',
  //     headers:{
  //       Accept:'application/json',
  //       'Content-Type':'application/json',
  //     },
  //     body:JSON.stringify({id:id})
  //   })
  //   await fetchInfo();
  // }

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto ">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">IMAGES</th>
              <th className="p-2 text-start">TITLE</th>
              <th className="p-2 text-start">PRICE</th>
              <th className="p-2 text-start">OFFER PRICE</th>
              <th className="p-2 text-start">CATEGORY</th>
              <th className="p-2 text-center">UPDATE</th>
              <th className="p-2 text-center">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.title} className="border-b">
                <td className="p-2 text-start">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="p-2 text-start">{product.title}</td>
                <td className="p-2 text-start">{product.price}</td>
                <td className="p-2 text-start">{product.offerPrice}</td>
                <td className="p-2 text-start">{product.category}</td>
                <td className="p-2 text-CENTER">
                  <button className=" text-black text-xl p-2 rounded">
                    {<i class="ri-edit-2-fill"></i>}
                  </button>
                </td>
                <td className="p-2 text-center">
                  <button
                    className=" text-red-600 p-2 text-black text-xl rounded"
                    onClick={() => {
                      remove_product(product.id);
                    }}
                  >
                    {<i class="ri-delete-bin-6-line"></i>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
