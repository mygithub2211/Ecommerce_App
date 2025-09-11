import { createContext, useEffect, useRef, useState } from "react"

export const CartContext = createContext({})

export function CartContextProvider({children}) {
    const [cartProducts, setCartProducts] = useState([])
    const hydrated = useRef(false)
   
   // 1) Initial load / hydration
    useEffect(() => {
        if (typeof window === "undefined") return

        const params = new URLSearchParams(window.location.search)
        const fromCheckoutSuccess = params.has('success')

        if (fromCheckoutSuccess) {
        // Returning from Stripe success: nuke stored cart before any hydration
        try { localStorage.removeItem('cart') } catch {}
            setCartProducts([])
            hydrated.current = true
            return
        }

        try {
            const saved = localStorage.getItem("cart")
            if (saved) setCartProducts(JSON.parse(saved))
        } catch {
            // corrupted value; clear it
            try { localStorage.removeItem('cart') } catch {}
            setCartProducts([])
        } finally {
            hydrated.current = true
        }
    }, [])

    // 2) Persist changes (only after hydration to avoid first-render races)
    useEffect(() => {
        if (typeof window === "undefined") return
        if (!hydrated.current) return

        if (cartProducts.length > 0) {
        try { localStorage.setItem("cart", JSON.stringify(cartProducts)) } catch {}
        } else {
        try { localStorage.removeItem("cart") } catch {}
        }
    }, [cartProducts])

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
        try {
            localStorage.removeItem('cart'); 
        } catch {}
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