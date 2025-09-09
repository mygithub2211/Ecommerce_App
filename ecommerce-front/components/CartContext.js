import { createContext, useEffect, useState } from "react"

export const CartContext = createContext({})

export function CartContextProvider({children}) {
    const [cartProducts, setCartProducts] = useState([])
   
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem("cart");
        if (saved) setCartProducts(JSON.parse(saved));
    }, []);
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (cartProducts.length) {
        localStorage.setItem("cart", JSON.stringify(cartProducts));
        } else {
        localStorage.removeItem("cart"); 
        }
    }, [cartProducts]);

    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId])
    }
    function removeProduct(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId)
            if(pos !== -1) {
                return prev.filter((value, index) => index !== pos)
            }
            return prev;
        })
    }
    function clearCart() {
        setCartProducts([])
    }
    return(
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct, removeProduct, clearCart}}>
            {children}
        </CartContext.Provider>
    )
}















  //const ls = typeof window !== "undefined" ? window.localStorage : null
 /*useEffect(() => {
        if(cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts))
        }
    }, [cartProducts])
    useEffect(() => {
        if(ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')))
        }
    },[])*/