'use client';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { useSwipeable } from 'react-swipeable';
import { BiCartAdd } from 'react-icons/bi'
import { RiBookMarkFill } from 'react-icons/ri'
import { add_to_cart } from '@/Services/common/cart'
import { bookmark_product, get_all_bookmark_items } from '@/Services/common/bookmark'
import { RootState } from '@/Store/store';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';

interface Product {
    title: string
    description: string
    images: string[]
    price: number
    _id: string
    inStock: boolean
    isFeatured: boolean
    sizeGuideUrl: string
};

interface ProductDetailsProps {
    product: Product
}

type User = {
    email: string,
    name: string,
    _id: string,
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const useParamObject = useParams<{ id: string }>()
  const id  = useParamObject.id;
  const [currentImage, setCurrentImage] = useState(0);
  const user = useSelector((state: RootState) => state.User.userData) as User | null
  
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentImage((prev) => (prev + 1) % product.images.length),
    onSwipedRight: () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const AddToCart = async () => {
        const finalData = { productID: id, userID: user?._id }
        const res = await add_to_cart(finalData);
        if (res?.success) {
            console.log('success' + res?.message);
        } else {
            throw new Error(res?.message)
        }
    }

    const AddToBookmark = async () => {
        const bmarkData = await get_all_bookmark_items(user?._id)
        if(bmarkData?.data?.length > 0){
            return false
        }else {
            const finalData = { productID: id, userID: user?._id }
            const res = await bookmark_product(finalData);
            if (res?.success) {
                console.log('success' + res?.message);
            } else {
                throw new Error(res?.message)
            }
        }
    }

  return (
    <div className="flex flex-col lg:flex-row justify-end bg-white text-black p-6 max-w-7xl mx-auto font-[Poppin]">
      <div className="w-full lg:max-w-[700px] mr-[25%]" {...handlers}>
        <div className="border rounded overflow-hidden h-[450px] relative">

          {product.images.map((src, index) => (
            <Transition
              as="div"
              key={index}
              show={currentImage === index}
              enter="transition-transform transform duration-500 ease-out"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition-transform transform duration-500 ease-out"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
              className="absolute inset-0"
            >
              <img
                src={src}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </Transition>
          ))}
          {product.isFeatured && (
            <div className="opacity-[50%] relative -mt-[4%] ml-[25%] pl-16 p-3 lg:max-w-[100%] origin-top-right rotate-0 translate-x-1/3 translate-y-1/3 bg-black text-white text-sm uppercase rounded shadow-lg">
              Featured
            </div>
          )}
        </div>



        <div className="flex gap-2 mt-4 justify-center">
          {product.images.map((src, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`border rounded overflow-hidden ${
                currentImage === index ? 'ring-2 ring-black' : ''
              }`}
            >
              <img src={src} alt={`Thumb ${index + 1}`} className="w-16 h-16 object-cover" />
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4 justify-center">
            <button onClick={AddToCart} className="hover:bg-white btn bg-white m-2 lg:w-52 h-10 flex items-center justify-center"> 
              <BiCartAdd className="text-3xl mx-2 text-black bg-white" /> 
            </button>
            <button onClick={AddToBookmark} className="hover:bg-white btn bg-white m-2 lg:w-52 h-10 flex items-center justify-center text-black-600 hover:text-red-800"> 
              <RiBookMarkFill className="text-3xl mx-2 text-black bg-white" />
            </button>
        </div>

      </div>

      <div className="w-full lg:max-w-[450px] space-y-6 ml-2">
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <div className="text-2xl font-semibold text-green-700">
          ${product.price.toFixed(2)}
        </div>

        <div>
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              product.inStock ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {product.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-base leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Size Guide</h2>
          <a
            href={product.sizeGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            View Size Guide
          </a>
        </div>
      </div>
    </div>

  );
}