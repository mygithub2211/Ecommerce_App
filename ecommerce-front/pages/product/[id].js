import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import CartIcon from "@/components/icons/CartIcon";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";

const ColWrapper = styled.div`
    display:grid;
    grid-template-columns:1fr;
    @media screen and (min-width:768px){
        grid-template-columns:.8fr 1.2fr;
    }
    gap:40px;
    margin-top:40px 0;
`
const PriceRow = styled.div`
    display:flex;
    gap:20px;
    align-items:center;
`
const Price = styled.span`
    font-size:1.4rem;
`
const Description = ({ text }) => {
    const raw = text == null ? "" : String(text);
    const lines = raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.replace(/^[-–—•]\s*/, "")); 
    if (lines.length <= 1) {
        return <p style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>{raw}</p>;
    }
    return (
        <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.6 }}>
        {lines.map((line, i) => (
            <li key={i}>{line}</li>
        ))}
        </ul>
    )
}

export default function ProductPage({product}) {
    const { addProduct } = useContext(CartContext)
    return (
        <>  
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images}/>
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <Description text={product.description} />
                        <PriceRow>
                            <Price>${product.price}</Price>
                            <div>
                                <Button primary onClick={() => addProduct(product._id)}><CartIcon />Add to cart</Button>
                            </div>  
                        </PriceRow>   
                    </div>
                </ColWrapper>
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect()
    const { id } = context.query
    const product = await Product.findById(id)
    return(
        {
            props:{
                product: JSON.parse(JSON.stringify(product)),
            }
        }
    )
}