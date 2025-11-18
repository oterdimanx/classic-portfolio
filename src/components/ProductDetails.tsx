'use client';
import { useState } from 'react';
//import { Transition } from '@headlessui/react';
import { useSwipeable } from 'react-swipeable';
import { BiCartAdd } from 'react-icons/bi'
import { RiBookMarkFill } from 'react-icons/ri'
import { add_to_cart } from '@/Services/common/cart'
import { bookmark_product, get_all_bookmark_items } from '@/Services/common/bookmark'
import { RootState } from '@/Store/store';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

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

  const [currentImage, setCurrentImage] = useState(0);
  const user = useSelector((state: RootState) => state.User.userData) as User | null
  const [arrBook, SetArrBook] = useState<any[]>([])

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentImage((prev) => (prev + 1) % product.images.length),
    onSwipedRight: () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const AddToCart = async () => {
        const finalData = { productID: product._id, userID: user?._id }
        const res = await add_to_cart(finalData);
        if (res?.success) {
            console.log(res?.message);
            toast.warning(res?.message)
        } else {
            toast.warning('Le produit est déjà dans votre panier')
            console.log('An error occured (AddToCart) : ' + res?.message)
        }
    }

    const AddToBookmark  =  async () => {
        const bmarkData = await get_all_bookmark_items(user?._id)

        if (bmarkData?.data?.length > 0){
            /* au moins un bookmark existe déjà
               on doit vérifier tous les objets retournés pour comparer avec l'id 
               du produit qui vient d'être bookmarké */

            bmarkData?.data.map((item: { productID: { _id: any; }; }) => {
                const book = [...arrBook,item.productID?._id]
                SetArrBook(book)
            })

            if(arrBook.includes(product?._id)){
                //console.log('id retrouve dans la liste ' + product?._id)

                toast.warning("Le bookmark existe déjà dans vos favoris", {
                  position: 'bottom-center',
                  className: 'custom-warning-shadow'
                })

                //notify("Le bookmark existe déjà dans vos favoris")

            }else{
                const finalData = { productID: product?._id, userID: user?._id }
                const res = await bookmark_product(finalData);
                if (res?.success) {
                    //console.log('bookmark added')
                    toast("Le bookmark a été ajouté aux favoris", {
                      position: 'bottom-center',
                      className: 'custom-warning-shadow'
                    })
                    /* le bookmark a bien été ajouté */
                } else {
                    console.log('An error occured (AddToBookmark) : ' + res?.message)
                }
            }

        } else {
            /* Il n'y a pas de bookmarks dans la liste, on peut ajouter */
            const finalData = { productID: product?._id, userID: user?._id }
            const res = await bookmark_product(finalData);
            if (res?.success) {
              //console.log('bookmark added')
              toast("Le bookmark a été ajouté aux favoris", {
                position: 'bottom-center',
                className: 'custom-warning-shadow'
              })
                // le bookmark a bien été ajouté
            } else {
                console.log('An error occured (AddToBookmark) : ' + res?.message)
                toast("Créez un compte et connectez-vous pour gérer vos favoris", {
                    position: 'bottom-center',
                    className: 'custom-warning-shadow toast-message'
                })
            }
        }
    }

  return (
<div className="flex flex-col lg:flex-row gap-6 bg-white text-black p-6 max-w-7xl mx-auto font-[Poppin]">
  <div className="w-full lg:w-1/2 mr-[10%]" {...handlers}>
    <div className="border rounded overflow-hidden relative aspect-[4/3]">  {/* Use aspect-ratio instead of fixed height for responsiveness */}
            {/*<Transition
              as="div"
              key={index}
              show={currentImage === index}
              enter="transition-transform transform duration-500 ease-out"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition-transform transform duration-500 ease-out"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
              className="inset-0"
            >the img tag goes here to reactivate transition (inside product.images.map</Transition>**/}
          {product.images.map((src, index) => (

              <img
                src={src}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover "
                key={`${index + 1}`}
              />
            
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

      <div className="w-full lg:w-1/2 flex flex-col gap-4 -ml-[5%] product-details-text-container">
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

        <ToastContainer />
{ /* 
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
*/}
      </div>
    </div>

  );
}