import React from 'react';
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from '@chakra-ui/react';




const Faq = () => {

    const faqs = [
        {
          category: "General Questions",
          questions: [
            {
              question: "What is Beatstake?",
              answer: "Beatstake is an online trading platform where fans can buy shares in songs of their favorite artists and earn dividends by listening to those songs on various streaming platforms such as YouTube Music, Napster, Tidal, Apple Music, Amazon Music, Spotify, Deezer, and others."
            },
            {
              question: "How does Beatstake work?",
              answer: "Fans purchase shares in songs, and by streaming those songs on supported platforms, they earn dividends. Dividends are paid out monthly and are based on the amount earned from all streaming platforms in your region."
            },
            {
              question: "Can non-artists sell shares on Beatstake?",
              answer: "Yes, non-artist rights holders such as Recording Labels or Investors can create a Merchant account, which allows them to sell shares on the platform."
            }
          ]
        },
        {
          category: "Buying and Selling Shares",
          questions: [
            {
              question: "How do I buy shares on Beatstake?",
              answer: "You can buy shares by creating an account on Beatstake, browsing available songs, and purchasing shares in the songs you are interested in."
            },
            {
              question: "Can I resell shares I’ve purchased?",
              answer: "Yes, fans can buy and resell shares on Beatstake."
            },
            {
              question: "How is the percentage of ownership calculated?",
              answer: "The percentage of ownership is calculated based on the number of shares you purchase. For example, if one share of a song equals 1% ownership and you buy 5 shares, you own 5% of the song."
            }
          ]
        },
        {
          category: "Earnings and Dividends",
          questions: [
            {
              question: "How are dividends calculated?",
              answer: "Dividends are calculated based on the earnings from all streaming platforms in your region. The percentage of the streaming revenue you receive is proportional to your percentage of song ownership. For instance, owning 5% of a song's shares entitles you to 5% of the earnings from that song's streams."
            },
            {
              question: "When are dividends paid out?",
              answer: "Dividends are paid out monthly."
            },
            {
              question: "How do I track my earnings?",
              answer: "You can track your earnings through your account dashboard on Beatstake, which will provide detailed reports on your dividends and the performance of your shares."
            }
          ]
        },
        {
          category: "Accounts and Security",
          questions: [
            {
              question: "What types of accounts are available on Beatstake?",
              answer: "There are three main types of accounts on Beatstake: Fan accounts for individuals who want to buy and sell shares, Artist accounts for artists to sell shares to fans, and Merchant accounts for non-artist rights holders like Recording Labels or Investors who want to sell shares."
            },
            {
              question: "How do I create an account?",
              answer: "You can create an account by visiting the Beatstake.com website, clicking on the sign-up button, and following the registration process."
            },
            {
              question: "How is my account information protected?",
              answer: "Beatstake uses industry-standard security measures to protect your account information, including encryption and secure login protocols."
            }
          ]
        },
        {
          category: "Streaming Platforms and Regions",
          questions: [
            {
              question: "Which streaming platforms are supported by Beatstake?",
              answer: "Beatstake supports various streaming platforms, including YouTube Music, Napster, Tidal, Apple Music, Amazon Music, Spotify, Deezer, and others."
            },
            {
              question: "How is the region determined for earnings calculations?",
              answer: "The region is determined based on the location from which the streams are generated. Earnings are calculated based on the performance of the song in that specific region. Your account region is based on your location at sign up and account confirmation."
            }
          ]
        },
        {
          category: "Social Media and Connectivity",
          questions: [
            {
              question: "How can I stay connected with Beatstake?",
              answer: "You can stay connected with Beatstake on your favorite social media platforms, including Facebook, Instagram, TikTok, Twitter, Snapchat, and Reddit."
            },
            {
              question: "Can I share my earnings and investments on social media?",
              answer: "Yes, Beatstake encourages users to share their success and investments on social media to build a community of music investors and fans."
            }
          ]
        }
      ];
      return (
        <Box p={5}>
      <Heading as="h2" size="lg" mb={5} color="dark.900"  py={5}>
        Frequently Asked Questions
      </Heading>
      {faqs.map((faqCategory, index) => (
        <Box key={index} mb={6}>
          <Heading as="h3" size="md" mb={2} color="dark.900">
            {faqCategory.category}
          </Heading>
          <Accordion allowToggle>
            {faqCategory.questions.map((faq, idx) => (
              <AccordionItem key={idx} borderTop="1px solid" borderColor="secondary.500">
                <AccordionButton _expanded={{ bg: 'primary.500', color: 'secondary.100' }}>
                  <Box flex="1" textAlign="left">
                    {faq.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} bg="primary.100" color="secondary.900">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      ))}
    </Box>
      );
};

export default Faq;
