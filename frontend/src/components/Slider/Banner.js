import { Box, theme, useTheme } from '@chakra-ui/react'
import React from 'react'
import Slider from "react-slick"
import "./slick.css"
import "./slick-theme.css"
import Herocard from '../Spotify/Herocard'



function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    const theme = useTheme()
    return (
      <div
        className={className}
        style={{ 
            ...style, 
            display: "block", 

        }
    
    }
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    );
  }
  

export default function Banner({ items }) {

  const settings = {
    dots: false,
    infinite: true,
    autoplay:true,
    autoplaySpeed:4000,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    
  };
    return (

        <Box borderRadius="10px" my={5} p={3}>
            <Slider {...settings} >
                {
                    items.map(item => (
                      
                        <Herocard item={{item,type:"song"}}/>
                        
                    ))
                }
            </Slider>

        </Box>
    )
}
