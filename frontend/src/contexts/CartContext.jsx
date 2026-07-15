import { createContext, useContext, useState } from "react";
import { getCart } from "../api/orderApi";


const CartContext = createContext();


export function CartProvider({ children }) {

    const [cartCount, setCartCount] = useState(0);


    const refreshCartCount = async () => {

        try {

            const carts = await getCart();


            setCartCount(
                carts.length
            );


        } catch (err) {

            console.error(err);

        }

    };


    return (

        <CartContext.Provider
            value={{
                cartCount,
                setCartCount,
                refreshCartCount
            }}
        >

            {children}

        </CartContext.Provider>

    );

}



export const useCart = () => useContext(CartContext);