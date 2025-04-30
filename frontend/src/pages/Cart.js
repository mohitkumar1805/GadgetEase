import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import BannerProduct from '../components/BannerProduct';
import Lottie from "lottie-react";
import animate from "../assest/banner/cart-empty.json";
import animateDrone from "../assest/banner/drone.json";
const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);
    const loadingCart = new Array(4).fill(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        });

        const responseData = await response.json();
        if (responseData.success) {
            setData(responseData.data);
        }
    }

    const handleLoading = async () => {
        await fetchData();
    }

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        });

        const responseData = await response.json();
        if (responseData.success) {
            fetchData();
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
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            });

            const responseData = await response.json();
            if (responseData.success) {
                fetchData();
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
            body: JSON.stringify({
                _id: id,
            })
        });

        const responseData = await response.json();
        if (responseData.success) {
            fetchData();
            context.fetchUserAddToCart();
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);

    return (
        <div className='flex flex-col mx-auto'>
            <div className='mt-5'><BannerProduct /></div>
            <div className='flex-col px-5'>
                <div className='mt- text-center text-lg my-3'>
                    {
                        data.length === 0 && !loading && (
                            <div className="flex flex-col md:flex-row w-full justify-center items-center p-4 gap-8">
                                <div className="flex justify-center items-center flex-col">
                                    <Lottie
                                        className="w-full max-w-sm rounded-full"
                                        animationData={animate}
                                    />
                                    <p className="text-slate-500 text-3xl font-bold">
                                        Empty Cart
                                    </p>
                                </div>
                                <div className='mt-5 lg:mt-0 w-full max-w-sm bg-white shadow-md rounded-lg p-5'>
                                    <h2 className='text-gray-900 font-semibold text-lg border-b-2 pb-2'>Summary</h2>
                                    <div className='flex mt-4 mb-2 items-center justify-between font-medium text-lg text-slate-600'>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>
                                    <div className='flex items-center mb-4 justify-between font-medium text-lg text-slate-600'>
                                        <p>Subtotal</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>
                                    </div>
                                    <button className='bg-gray-900 hover:bg-gray-700 p-2 font-semibold rounded-lg text-white w-full mt-2' onClick={e => navigate("/checkout")}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className='flex flex-col mt-5 mb-5 lg:flex-row gap-10 lg:justify-between p-4'>
                    <div className='w-full max-w-3xl'>
                    <Lottie
                                        className="w-full max-w-sm rounded-full"
                                        animationData={animateDrone}
                                    />
                        {
                            loading ? (
                                loadingCart.map((el, index) => {
                                    return (
                                        <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                        </div>
                                    )
                                })
                            ) : (
                                 
                                data.map((product, index) => {
                                    return (
                                        
                                      <>
                                     
                                        <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                            <div className='w-32 h-32 bg-slate-200'>
                                                <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                            </div>
                                            <div className='px-4 py-2 relative'>
                                                <div className='absolute right-0 text-gray-900 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                    <MdDelete />
                                                </div>
                                                <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                                <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                                <div className='flex items-center justify-between'>
                                                    <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                    <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                                </div>
                                                <div className='flex items-center gap-3 mt-1'>
                                                    <button className='border border-gray-900 text-gray-900 hover:bg-gray-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                                    <span>{product?.quantity}</span>
                                                    <button className='border border-gray-900 text-gray-900 hover:bg-gray-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                      </>
                                    )
                                })
                            )
                        }
                    </div>
                    {data.length > 0 && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm bg-white shadow-md rounded-lg p-5'>
                            <h2 className='text-gray-900 font-semibold text-lg border-b-2 pb-2'>Summary</h2>
                            <div className='flex mt-4 mb-2 items-center justify-between font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>
                            <div className='flex items-center mb-4 justify-between font-medium text-lg text-slate-600'>
                                <p>Subtotal</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>
                            <button className='bg-gray-900 hover:bg-gray-700 p-2 font-semibold rounded-lg text-white w-full mt-2' onClick={e => navigate("/checkout")}>
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart;
