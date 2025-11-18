import { bookmark_product, get_all_bookmark_items } from '@/Services/common/bookmark'
import { add_to_cart } from '@/Services/common/cart'
import { RootState } from '@/Store/store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BsCartPlus } from 'react-icons/bs'
import { GrFavorite } from 'react-icons/gr'
import { MdFavorite } from 'react-icons/md'
import { useSelector } from 'react-redux'
import LearnMore from './LearnMore'
import { toast, ToastContainer } from 'react-toastify'

type ProductData = {
    productName: string,
    productImage: string,
    productSlug: string,
    productQuantity: number,
    productPrice: number,
    productFeatured: Boolean,
    productCategory: {
        categoryName: string,
        categoryDescription: string,
        _id: string,
    },
    _id: string
};

type User = {
    email : string , 
    name : string , 
    _id : string,
}

export default function ProductCard({ productName, productImage, productPrice, _id, productSlug, productQuantity }: ProductData) {

    const router = useRouter();
    const user = useSelector((state: RootState) => state.User.userData) as User | null
    const [arrBook, SetArrBook] = useState<any[]>([])
    const [animate, setAnimate] = useState(false)

    const AddToCart = async () => {
        const finalData = { productID: _id, userID: user?._id }
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

            if(arrBook.includes(_id)){
                console.log('id retrouve dans la liste ' + _id)
                /*
                toast.warning("Le bookmark existe déjà dans vos favoris 1", {
                    toastId: 'bookmark-error2',
                    autoClose: 1000, 
                    position: 'bottom-center',
                    className: 'custom-warning-shadow toast-message'
                })*/
            }else{

                const finalData = { productID: _id, userID: user?._id }
                const res = await bookmark_product(finalData);
                if (res?.success) {
                    //console.log('bookmark added')
                    toast("Le bookmark a été ajouté aux favoris", {
                        toastId: 'bookmark-error3',
                        autoClose: 1000, 
                        position: 'bottom-center',
                        className: 'custom-warning-shadow toast-message'
                    })
                    /* le bookmark a bien été ajouté */
                } else {
                    toast.warning("Le bookmark est déjà dans vos favoris", {
                        toastId: 'bookmark-error4',
                        autoClose: 1000, 
                        position: 'bottom-center',
                        className: 'custom-warning-shadow toast-message'
                    })
                    console.log('An error occured (AddToBookmark) : ' + res?.message)
                }
            }

        } else {
            /* Il n'y a pas de bookmarks dans la liste, on peut ajouter */
            const finalData = { productID: _id, userID: user?._id }
            const res = await bookmark_product(finalData);
            if (res?.success) {
                //console.log('bookmark added')
                toast("Le bookmark a été ajouté aux favoris", {
                    toastId: 'bookmark-error5',
                    autoClose: 1000, 
                    position: 'bottom-center',
                    className: 'custom-warning-shadow toast-message'
                })
                // le bookmark a bien été ajouté
            } else {
                console.log('An error occured (AddToBookmark) : ' + res?.message)
                toast("Créez un compte et connectez-vous pour gérer vos favoris", {
                    toastId: 'bookmark-error6',
                    autoClose: 1000, 
                    position: 'bottom-center',
                    className: 'custom-warning-shadow toast-message'
                })
            }
        }
    }

    const HandleAddToBookmarkClick = () => {
        if (!animate) {  // Prevent multiple triggers if clicked rapidly
            setAnimate(true);
            AddToBookmark();
        }
    };

    const handleAnimationEnd = () => {
        setAnimate(false);
    };

    return (
        <>
        <div className="card text-black cursor-pointer card-compact m-3 w-80 bg-white shadow-xl relative">
            <div onClick={() => router.push(`/product/product-detail/${productSlug}`)} className='w-full rounded relative h-60'>
                <Image src={productImage || '/ryu.gif'} alt='no Image' className='rounded' fill sizes='50vw' />
                {(productQuantity === 0 || productQuantity === null) && (
                    <div className="absolute top-0 right-0 w-[120px] h-[120px] overflow-hidden z-10 pointer-events-none">
                        <div className="absolute top-6 -right-9 bg-gradient-to-b from-red-500 to-red-700 text-white text-center font-bold text-xs uppercase py-1.5 w-[160px] rotate-45 shadow-[0_4px_10px_rgba(0,0,0,0.4)] 
                        before:content-[''] before:absolute before:bottom-[-8px] before:border-t-[8px] before:border-t-red-800 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:left-0
                        after:content-[''] after:absolute after:bottom-[-8px] after:border-t-[8px] after:border-t-red-800 after:border-l-[8px] after:border-l-transparent after:border-r-[8px] after:border-r-transparent after:right-0">
                        &nbsp;&nbsp;&nbsp;Out of Stock
                        </div>
                    </div>
                )}
            </div>
            <div className="card-body">
                <h2 className="card-title" onClick={() => router.push(`/product/product-detail/${productSlug}`)}>{productName} </h2>
                <p className='font-semibold' onClick={() => router.push(`/product/product-detail/${productSlug}`)}>&euro;{` ${productPrice}`}</p>
                <div className="card-actions justify-end z-20">
                    <LearnMore productLink={productSlug} />
                    

                    <button onClick={AddToCart} className="btn btn-circle btn-ghost" disabled={productQuantity === 0 || productQuantity === null}>
                        <BsCartPlus className="text-2xl text-red-600 font-semibold" />
                    </button>
                    <button onClick={HandleAddToBookmarkClick} className="btn btn-circle btn-ghost absolute top-0 right-0">
                        <MdFavorite className={`text-2xl text-red-600 font-semibold ${animate ? 'animate-beat' : ''}`} onAnimationEnd={handleAnimationEnd} />
                    </button>
                </div>
            </div>
        </div>
        <ToastContainer /></>
    )
}
