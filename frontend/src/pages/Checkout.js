import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import animate from "../assest/banner/cart-empty.json";
import animatecard from "../assest/banner/card.json";

function Checkout() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const context = useContext(Context)
  const loadingCart = new Array(4).fill(null)
  const navigate = useNavigate();


  const fetchData = async () => {

    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
    })


    const responseData = await response.json()
    console.log(responseData.data);
    if (responseData.success) {
      setData(responseData.data)
    }




  }

  const handleLoading = async () => {
    await fetchData()
  }



  const makePayment = async () => {


    const stripe = await loadStripe("pk_test_51PJVJZSGpZvoPybB6Lo8vRzPKB9D4VFf2B2gbMdUeWAZsLvE1K3BAMoP15vOlYVhcSr09ZJxBtMOGt3vy6vTRdgF002QzXQMrt");

    const response = await fetch(SummaryApi.userCheckOut.url, {
      method: SummaryApi.userCheckOut.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
    });

    const responsebody = await response.json();
    console.log(responsebody);
    if (responsebody.error) {
      toast(responsebody.message)
    }
    const result = stripe.redirectToCheckout({
      sessionId: responsebody.id
    });

    if (responsebody.error) {
      console.log(result.error);
    }
  }

  useEffect(() => {
    setLoading(true)
    handleLoading()
    setLoading(false)
  }, [])




  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify(
        {
          _id: id,
          quantity: qty + 1
        }
      )
    })

    const responseData = await response.json()


    if (responseData.success) {
      fetchData()
    }
  }


  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify(
          {
            _id: id,
            quantity: qty - 1
          }
        )
      })

      const responseData = await response.json()


      if (responseData.success) {
        fetchData()
      }
    }
  }

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify(
        {
          _id: id,
        }
      )
    })

    const responseData = await response.json()

    if (responseData.success) {
      fetchData()
      context.fetchUserAddToCart()
    }
  }

  const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
  const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)
  return (
    <div className='flex-col'>
      <div className='flex h-16 w-full bg-slate-200 items-center text-2xl font-semibold place-content-center'>
        <h1 className=''>Checkout ({totalQty} items)</h1>
      </div>

      <div className='border-b-2 mt-5 px-8'>
        <div className='mb-5'>
          <span className='text-2xl font-semibold'>Delivery Address  </span>
        </div>
        <div className='mb-8'>
          <form className='px-80'>
            <div className=" border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive order.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    Country
                  </label>
                  <div className="mt-2">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>India</option>
                      <option>Nepal</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div> */}
          </form>
        </div>
      </div>
      <div className='border-b-2 mt-5 px-8 '>
        <div className='border-b-2'>
          <div className='mb-5'>
            <span className='text-2xl font-semibold'>Review items and delivery  </span>
          </div>

          <div className='mt- text-center text-lg my-3'>
            {
              data.length === 0 && !loading && (
                <div className="flex flex-col md:flex-row w-full justify-center items-center p-4 gap-8">
                  <div className="flex justify-center items-center flex-col">
                    <Lottie
                      className="w-full max-w-sm rounded-full"
                      animationData={animate}
                    />

                  </div>
                </div>
              )
            }
            <div className='mt- text-center text-lg my-3'>

              <div className='px-20 mb-8'>
                <div className='w-full ml-60 max-w-3xl'>
                  {
                    loading ? (
                      loadingCart?.map((el, index) => {
                        return (
                          <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>

                          </div>
                        )
                      })

                    ) : (
                      data.map((product, index) => {
                        return (
                          <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                            <div className='w-32 h-32 bg-slate-200'>
                              <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                            </div>
                            <div className='px-4 py-2 relative'>
                              {/**delete product */}
                              <div className='absolute right-0 text-gray-900 rounded-lg p-2 hover:bg-red-600 hover:text-white cursor-pointer text-lg font-semibold mr-4' onClick={() => deleteCartProduct(product?._id)}>
                                <span><MdDelete /></span>
                              </div>

                              <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                              <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                              <div className='flex items-center justify-between'>
                                <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>

                              </div>

                            </div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='border-b-slate-400 mt-5 px-8'>
          <div className='mb-5'>
            <span className='text-2xl font-semibold'>Payment Method </span>
          </div>
          <div className='px-80 mb-12'>
            <div className="flex flex-col md:flex-row w-full justify-center items-center p-4 gap-8">
              <div className="flex justify-center items-center flex-col">
                <Lottie
                  className="w-full max-w-sm rounded-full"
                  animationData={animatecard}
                />
                <p className="text-slate-500 text-3xl font-bold">
                  CARD
                </p>
              </div>
            </div>
            <div className='mt-8'><span className=' text-lg font-bold'>Order Total <span className='text-red-600 font-bold'>{"₹" + totalPrice}</span></span></div>
            <button className='mt-10 bg-gray-900 hover:bg-gray-700 h-12 w-full font-semibold text-white px-3 py-0.5 text-xl rounded-lg' onClick={makePayment}>Buy now</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
