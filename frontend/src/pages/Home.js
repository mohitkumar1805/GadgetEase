import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import VerticalCardProductForRent from '../components/VerticalCardProductForRend'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"airpodes"} heading={"Top Airpodes"}/>
      <HorizontalCardProduct category={"watches"} heading={"Popular Watches"}/>

      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
      
      <VerticalCardProduct category={"televisions"} heading={"Televisions"}/>
      <VerticalCardProductForRent category={"televisions for rent"} heading={"Televisions for rent"}/>
      <VerticalCardProductForRent category={"microwave for rent"} heading={"Microwave for rent"}/>
      <VerticalCardProductForRent category={"Washingmachine for rent"} heading={"Washing machine for rent"}/>
      <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Earphones"}/>
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerators"}/>
      <VerticalCardProductForRent category={"refrigerator for rent"} heading={"Refrigerator for rent"}/>
      <VerticalCardProductForRent category={"ac for rent"} heading={"AC for rent"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/>
    </div>
  )
}

export default Home