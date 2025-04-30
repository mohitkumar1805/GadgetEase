import React from 'react'
import { MdModeEditOutline, MdDelete  } from "react-icons/md";
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common'

const AdminOrdersCard = ({ data, fetchdata }) => {
  
  const product = data.products[0];
  const productImage = product ? product.productImage : null;
  const productName = product ? product.productName : "Unknown Product";
  const totalAmount = data.totalAmount;
  const quantity = product.quantity; 
  const status = data.status;
  const orderDate = new Date(data.createdAt); 

  // Format the date and time
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });


  const handleDelete = async()=>{
    try {
        const response = await fetch(SummaryApi.deleteOrder.url, {
          method: SummaryApi.deleteOrder.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: data._id }),
        });
        const result = await response.json();
        if (result.success) {
          fetchdata(); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
  }
  return (
    <div className='bg-white p-4 rounded-lg '>
      <div className='w-64 h-96 flex flex-col items-center'>
        <div className='w-32 h-32 flex justify-center items-center'>
          {productImage ? (
            <img src={productImage} className='mx-auto object-fill h-full' alt="Product" />
          ) : (
            <div className='mx-auto object-fill h-full text-gray-500'>No Image</div>
          )}
        </div>
        <h1 className='text-ellipsis line-clamp-2 text-xl'>{productName}</h1>
        <div className='flex flex-col flex-grow'>
        <h1 className='text-ellipsis line-clamp-2 text-xl font-semibold'>{productName}</h1>
        <div className='text-gray-600 mt-2'>
          <p>Order Date: {formattedDate}</p>
          <p>Order Time: {formattedTime}</p>
          <p>Qty: {quantity}</p>
        </div>
      </div>

        <div className='mt-4  text-start '>
        <div className='flex justify-between'>
          <p className='font-semibold'>Total Amount  .</p>
          <p className='font-semibold text-green-500'>{displayINRCurrency(totalAmount)}</p>
        </div>
        <div className='flex justify-between '>
          <p className='font-semibold'>Payment</p>
          <p className='font-semibold text-green-500'>{status}</p>
        </div>
      </div>
      <div className='flex items-center mt-4'>
          {/* Uncomment if you want to enable edit functionality */}
          {/* <div className='p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer mr-2'>
            <MdModeEditOutline />
          </div> */}
          <div className='p-2 mt-4 bg-red-100 hover:bg-red-600 px-10 rounded-lg hover:text-white cursor-pointer' onClick={handleDelete}>
           <span className='font-semibold'>Delete</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default AdminOrdersCard
