import React, { useEffect, useState, useContext } from 'react'
import SummaryApi from '../common'
import UserOrderCard from '../components/UserOrderCard'


function UserOrderList() {
  const [order, setOrder] = useState([])


  const fetchAllOrder = async () => {
    const response = await fetch(SummaryApi.userOrder.url, {
      method: SummaryApi.userOrder.method,
      credentials: 'include',
      headers: {
          "content-type": 'application/json'
      },
  });
    const dataResponse = await response.json()

    console.log("User orders", dataResponse)

    setOrder(dataResponse?.data || [])
  }

  useEffect(() => {
    fetchAllOrder()
  }, [])

  return (
    <div>
      <div className='bg-white py-4 px-4 flex justify-center items-center'>
        <h2 className='font-bold text-2xl'>Orders</h2>
      </div>

      {/**all orders */}
      <div className='flex items-center flex-wrap gap-5 py-4  overflow-y-scroll'>
        {
          order.map((orderItem, index) => {
            return (
             <div className='w-full px-6'>
               <UserOrderCard data={orderItem} key={index + "allOrder"} fetchdata={fetchAllOrder} />
             </div>
            
            )
          })
        }
      </div>
    </div>
  )
}

export default UserOrderList
