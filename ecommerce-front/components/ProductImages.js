import { useState, useEffect } from "react";
import styled from "styled-components";

const BigImageWrapper = styled.div` 
  max-width: 360px;
  margin: 0 auto 12px;
  aspect-ratio: 1 / 1;           
  background: #fafafa;
  border-radius: 12px;
  display: grid;
  place-items: center;
  overflow: hidden;               
`
const BigImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;            
`
const ImageButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: center;
  flex-wrap: wrap;
`
const ImageButton = styled.div`
  box-sizing: border-box;         
  width: 60px;                    
  height: 60px;
  padding: 4px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  border: 2px solid ${props => (props.active ? "#666" : "transparent")};
  opacity: ${props => (props.active ? 1 : 0.7)};
  transition: border-color .12s ease, opacity .12s ease;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
`
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;            
  pointer-events: none;          
`

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0] || "");

  useEffect(() => {
    if (images?.length) setActiveImage(images[0]);
  }, [images]);

  return (
    <>
      <BigImageWrapper>
        {activeImage ? <BigImage src={activeImage} alt="" /> : null}
      </BigImageWrapper>
      <ImageButtons>
        {(images ?? []).map((image) => (
          <ImageButton
            key={image}
            active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <Image src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
