import { background, border, extendTheme } from "@chakra-ui/react";

// Custom colors
let primaryOne = "rgb(252, 252, 252)";
let primaryTwo = "rgb(214,214,214)";
let primaryThree = "rgb(198, 198, 198)";
let secondaryOne = "rgb(44, 44, 44)";
let secondaryTwo = "rgb(59, 59, 59)";
let secondaryThree = "rgb(92,92,92)";
let secondaryFour = "rgb(75,75,75)"
let dark = "rgb(38,38,38)";
let darkOne = "rgb(47,47,47)";
let brand = "#cfb182";

let transparent = "rgba(38,38,38,0.6)";

const theme = extendTheme({
  fonts: {
    heading: "Philosopher",
    body: "Lato, sans-serif",
  },
  colors: {
    primary: {
      100: primaryOne,
      500: primaryTwo,
      900: primaryThree,
    },
    secondary: {
      100: secondaryOne,
      500: secondaryTwo,
      700:  secondaryFour,
      900: secondaryThree,
    },
    dark: {
      100: dark,
      200: transparent,
      500: darkOne,
      900: brand,
    },
  },
  styles: {
    global: {
      "@font-face": [
        {
          fontFamily: "Arvo",
          src: `url('/fonts/Arvo-Regular.ttf') format('truetype')`,
          fontWeight: "normal",
          fontStyle: "normal",
        },
        {
          fontFamily: "Lato",
          src: `url('/fonts/Lato-Black.ttf') format('truetype')`,
          fontWeight: "normal",
          fontStyle: "normal",
        },
        {
          fontFamily: "Philosopher",
          src: `url('/fonts/Philosopher-Regular.ttf') format('truetype')`,
          fontWeight: "normal",
          fontStyle: "normal",
        },
      ],
      "html, body": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        fontFamily: "body",
        lineHeight: "base",
        backgroundColor: dark,
        color: primaryThree,
      },
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: `${secondaryTwo} ${secondaryOne}`,
      },
      "*::-webkit-scrollbar": {
        width: "6px",
        scrollbarWidth: "thin",
        scrollbarColor: `${secondaryTwo} ${secondaryOne}`,
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: secondaryOne,
        borderRadius: "full",
        scrollbarWidth: "thin",
        scrollbarColor: `${secondaryTwo} ${secondaryOne}`,
      },
      "*::-webkit-scrollbar-track": {
        backgroundColor: secondaryOne,
        scrollbarWidth: "thin",
        scrollbarColor: `${secondaryTwo} ${secondaryOne}`,
      },
    },
  },
  components: {
    Menu: {
      baseStyle: {
        list: {
          bg: secondaryTwo,
          color: primaryThree,
          border: "none",
          borderColor: brand,
        },
        item: {
          bg: secondaryTwo,
          color: primaryTwo,
          _hover: {
            bg: secondaryOne,
            color: brand,
          },
          _focus: {
            bg: dark,
            color: brand,
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            appearance: "none",
            color: primaryTwo,
            bg: secondaryThree,
            _focus: {
              background:"brand",
              color: primaryOne,
              borderColor: brand,
            },
            _hover: {
              bg: secondaryOne,
              color: primaryOne,
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
        flushed: {
          field: {
            appearance: "none",
            color: primaryTwo,
            bg: dark,
            padding:"2px",
            borderBottom:"1px solid",
            borderColor:brand,
            _focus: {
              borderBottom:"2px solid",
              borderColor:brand,
            },
            _hover: {
              borderBottom:"2px solid",
              borderColor:brand, 
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
        outline: {

          field: {
            appearance: "none",
            border: "1px solid",
            borderColor: brand,
            color: primaryOne,
            bg: "transparent",
            _focus: {
              borderColor: brand,
            },
            _hover: {
              borderColor: secondaryTwo,
              color: primaryTwo,
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
        light: {
          field: {
            appearance: "textfield",
            
            border: "1px solid",
            borderColor: primaryThree,
            color: secondaryOne,
            bg: primaryOne,
            _focus: {
              borderColor: secondaryOne,
            },
            _hover: {
              borderColor: secondaryTwo,
              color: secondaryTwo,
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            color: primaryTwo,
            bg: secondaryThree,
            _focus: {
              color: primaryOne,
              borderColor: brand,
            },
            _hover: {
              bg: secondaryOne,
              color: primaryOne,
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
        light: {
          field: {
            border: "1px solid",
            borderColor: primaryThree,
            color: secondaryOne,
            bg: primaryOne,
            _focus: {
              borderColor: secondaryOne,
            },
            _hover: {
              borderColor: secondaryTwo,
              color: secondaryTwo,
            },
            _placeholder: {
              color: primaryThree,
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        content: {
          bg: primaryOne,
          color: secondaryTwo,
        },
        header: {
          textAlign: "center",
          fontWeight: "bold",
          color: secondaryTwo,
          borderBottom: "1px solid",
          bg: primaryOne,
          borderColor: brand,
          padding: "1rem",
        },
        body: {
          padding: "1rem",
          bg: primaryOne,
          color: secondaryOne,
        },
      },
    },
    Tabs: {
      parts: ["tabList", "tab", "tabPanel"],
      baseStyle: {
        tabList: {
          borderBottom: "2px solid",
          mb: 4,
          display: "flex",
          justifyContent: "space-around",
          bg: secondaryThree,
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "sm",
        },
        tab: {
          color: primaryThree,
          borderBottom: "1px solid",
          borderColor: secondaryThree,
          transition: "all 0.3s ease-in-out",
          padding: "12px 16px",
          borderColor: brand,
          color: brand,
          _selected: {
            fontWeight: "bold",
            color: brand,
            borderBottom: "1px solid",
            borderColor: brand,
            bg: secondaryTwo,
            borderRadius: "2px",
          },
          _hover: {
            fontWeight: "bold",
            borderBottom: "1px solid",
            borderColor: brand,
            color: brand,
            bg: secondaryTwo,
          },
        },
      },
      variants: {
        "my-variant": {
          tab: {
            color: primaryOne,
            _selected: {
              color: secondaryOne,
              backgroundColor: secondaryTwo,
              borderColor: secondaryTwo,
            },
            _hover: {
              backgroundColor: primaryThree,
              color: primaryTwo,
            },
          },
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        textTransform: "capitalize",
        borderRadius: "sm",
      },
      sizes: {
        md: {
          fontSize: "md",
          px: "4",
          py: "2",
        },
      },
      variants: {
        solid: {
          bg: secondaryTwo,
          color: primaryThree,
          boxShadow: "dark-lg",
          _hover: {
            bg: secondaryOne,
          },
        },
        ghost: {
          color: primaryThree,
          bg: "transparent",
          _hover: {
            bg: brand,
            color: secondaryOne,
          },
        },
        glassy: {
          bg: brand,
          color: secondaryTwo,
          boxSizing:"border-box",
          _hover: {
            bg: "dark.500",
            border: `1px solid ${brand}`,
            color: brand,
          },
        },
        brand: {
          bg: brand,
          color: secondaryTwo,
          _hover: {
            bg: "transparent",
            border: `1px solid ${brand}`,
            color: secondaryOne,
          },
        },
      },
      defaultProps: {
        size: "md",
        variant: "solid",
      },
    },
  },
});

export default theme
