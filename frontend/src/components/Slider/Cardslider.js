import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Heading } from '@chakra-ui/react';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
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


export default function Cardslider({ children}) {





  // let settings = {
  //     arrows: true,
  //     dots: true,
  //     infinite: true,
  //     slidesToShow: 4,
  //     slidesToScroll: 1,
  //     autoplay: true,
  //     speed: 500,
  //     autoplaySpeed: 2000,
  //     cssEase: "easein",
  //     responsive: [
  //       {
  //         breakpoint: 1024,
  //         settings: {
  //           slidesToShow: 3,
  //           slidesToScroll: 1,
  //           infinite: true,
  //           dots: true
  //         }
  //       },
  //       {
  //         breakpoint: 600,
  //         settings: {
  //           slidesToShow: 2,
  //           slidesToScroll: 1,
  //           initialSlide: 0
  //         }
  //       },
  //       {
  //         breakpoint: 480,
  //         settings: {
  //           slidesToShow: 1,
  //           slidesToScroll: 1
  //         }
  //       }
  //     ]
  //   };


  let len = children.length
  let settings = {
    
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    autoplay:true,
    autoplaySpeed:3000,
    slidesToScroll: 4,
    initialSlide: 1,
    rows:1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1456,
        settings: {
          infinite: len > 4 ? true:false,
          slidesToShow: 4,
          slidesToScroll: 2,
        
        }
      },
      
      {
        
        breakpoint: 1024,
        settings: {
          infinite: len > 3 ? true:false,
          slidesToShow: 3,
          slidesToScroll: 1,
         
   
        }
      },
      {

        breakpoint: 768,
        settings: {
          infinite: len > 2 ? true:false,
          slidesToShow: 2,
          slidesToScroll: 1,
      
        }
      },
      {
        breakpoint: 480,
        settings: {
          infinite: len > 1 ? true:false,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  

  return (

      <Box p={3}>
        <Slider {...settings}>
          {children}
        </Slider>
      </Box>


  );
}
