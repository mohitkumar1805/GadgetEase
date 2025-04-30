import React from 'react';
import displayINRCurrency from '../helpers/displayCurrency';

const UserOrderCard = ({ data }) => {
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

  return (
    <div className='bg-white p-4 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4 w-full'>
      <div className='w-32 h-32 flex-shrink-0'>
        {productImage ? (
          <img src={productImage} className='object-cover h-full w-full rounded-lg' alt="Product" />
        ) : (
          <div className='flex justify-center items-center h-full w-full bg-gray-100 rounded-lg text-gray-500'>No Image</div>
        )}
      </div>

      <div className='flex flex-col flex-grow'>
        <h1 className='text-ellipsis line-clamp-2 text-xl font-semibold'>{productName}</h1>
        <div className='text-gray-600 mt-2'>
          <p>Order Date: {formattedDate}</p>
          <p>Order Time: {formattedTime}</p>
          <p>Qty: {quantity}</p>
        </div>
      </div>

      <div className='flex flex-col flex-shrink-0 text-right'>
        <div className='flex justify-between md:justify-end md:gap-4'>
          <p className='font-semibold'>Total Amount:</p>
          <p className='font-semibold text-green-500'>{displayINRCurrency(totalAmount)}</p>
        </div>
        <div className='flex justify-between md:justify-end md:gap-4 mt-2'>
          <p className='font-semibold'>Payment:</p>
          <p className={`font-semibold ${status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>{status}</p>
        </div>
      </div>
    </div>
  );
}

export default UserOrderCard;
