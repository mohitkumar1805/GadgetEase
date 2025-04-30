import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import AdminOrdersCard from '../components/AdminOrdersCard'

function AllOrders() {
  const [order, setOrder] = useState([])

  const fetchAllOrder = async () => {
    const response = await fetch(SummaryApi.allOrder.url)
    const dataResponse = await response.json()

    console.log("All orders", dataResponse)

    setOrder(dataResponse?.data || [])
  }

  useEffect(() => {
    fetchAllOrder()
  }, [])

  return (
    <div>
      <div className='bg-white py-4 px-4 flex justify-center items-center'>
        <h2 className='font-bold text-2xl'>All Orders</h2>
      </div>

      {/**all orders */}
      <div className='flex items-center flex-wrap gap-5 py-4  overflow-y-scroll'>
        {
          order.map((orderItem, index) => {
            return (
              <AdminOrdersCard data={orderItem} key={index + "allOrder"} fetchdata={fetchAllOrder} />
            )
          })
        }
      </div>
    </div>
  )
}

export default AllOrders
