import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import styled from "./footer.module.css";
import LICIOUS from "../D'LICIOUS.jpeg";

const Footer = () => {
  return (
    <div className={styled.maxWidth} style={{maxWidth:'75%',marginTop:'100px'}}>

    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>
    <img className={styled.firstimg} src={LICIOUS} alt="footerlogo" />
    <div style={{width:'100%',height:'1px',backgroundColor:'grey',marginBottom:'10px',opacity:'.25'}}></div>
    </div>
      {/* useful links footer */}
      <div className={styled.fmdiv}>
        {/* first footer div column*/}
        <div>
          <li className={styled.firli}><b>USEFUL LINKS</b></li>
          <li>Why MNW?</li>
          <li>Refer & Earn</li>
          <li>MNW Cash & Cash+</li>
          <li>Careers</li>
          <li>BLOG</li>
          <li>Campaign</li>
          <li>Bug Bounty Guidelines</li>
          <li>About Us</li>
        </div>

        {/* second footer div column*/}
        <div>
          <li className={styled.logos}><b>EXPERIENCE MNW APP ON MOBILE</b></li>
          <div className={styled.apps}>
            <a href="" target="_blank"><img
              style={{ width: "120px", height: "40px" }}
              src="https://www.licious.in/image/rebranding/png/app-store-homepage.png" alt="" />
            </a>
            <a href="" target="_blank">
              <img
                style={{ marginLeft: "15px", width: "120px", height: "40px" }}
                src="https://www.licious.in/image/rebranding/png/playstore-homepage.png" alt="" />
            </a>
          </div>
        </div>

        {/* Third footer div */}

        <div>
          <div>
            <li style={{ fontWeight: "600px", color: "rgb(100 100 100)" }}>
              <b>CONTACT US</b>
            </li>
            <li>Call: 1800-4190-786</li>
            <li> Talktous@mnw.com</li>
          </div>

          <div style={{ marginTop: "12px" }}>
            <li style={{ fontWeight: "600px", color: "rgb(100 100 100)" }}>
              <b>REGISTERED OFFICE ADDRESS:</b>
            </li>
            <li>plot no. -3,</li>
            <li>Infocity Avenue ,</li>
            <li>Patia, Bhubaneswar, 751024</li>
          </div>
        </div>
        {/* Fourth part of footer div */}

        <div>
          <div>
            <li>T&C</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
          </div>

          <div style={{ marginTop: "12px" }}>
            <li style={{ fontWeight: "600px", color: "rgb(100 100 100)" }}>
              <b>HAVE SECURITY CONCERN?</b>
            </li>
            <li>Mail us to:</li>
            <li>security@licious.com</li>
          </div>
        </div>

        <div>
          <img
            style={{ width: "70px" }}
            src={LICIOUS}
            alt="footercartlogo" />
        </div>
      </div>
      {/* useful links footer */}


      <hr style={{ margin: "1%" }} />
      {/* social media div */}
      <div className={styled.fmiddiv}>
        <span>KEEP IN TOUCH</span>
        <a href="https://www.instagram.com/licious_foods/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram i1"></i></a>
        <a href="https://www.facebook.com/LiciousFoods/" target="_blank" rel="noreferrer" ><i className="fa-brands fa-facebook-square i2"></i></a>
        <a href="https://twitter.com/LiciousFoods" target="_blank" rel="noreferrer" ><i className="fa-brands fa-twitter i3"></i></a>
      </div>
      {/* social media div */}

      <hr style={{ margin: "1%" }} />

      {/*   <div className={styled.endFooter}>
        <img src={Footer1} alt="" />
        <img src={Footer2} alt="" />
      </div> */}


      {/* more no of listed div */}
      <div className={styled.citidiv}>
        <Text fontWeight='600'>CITIES WE SERVE</Text>
        <Box className={styled.cities}>
          <Text>
            Bangaluru
          </Text>

          <Text>
            NCR
          </Text>

          <Text>
            Hydrabad
          </Text>

          <Text>
            Chandigarh
          </Text>

          <Text>
            Panchkula
          </Text>

          <Text>
            MohaText
          </Text>

          <Text>
            Mumbai
          </Text>

          <Text>
            Pune
          </Text>

          <Text>
            chennai
          </Text>

          <Text>
            Coimbatore
          </Text>

          <Text>
            Jaipur
          </Text>

          <Text>Cochin</Text>


          <Text>
            Visakhapatnam
          </Text>

          <Text>
            Pondicherry
          </Text>

          <Text>
            Kolkata
          </Text>

          <Text>
            Trichy
          </Text>

          <Text>
            Lucknow
          </Text>

          <Text>
            Kanpur
          </Text>

          <Text>
            Agra
          </Text>

          <Text>
            Thrissur
          </Text>

          <Text>
            Nagpur
          </Text>

          <Text>
            Bhilai
          </Text>

          <Text>
            Nashik
          </Text>

          <Text>Palakkad</Text>
        </Box>
      </div>



<br /><hr /><br />
      <p style={{ textAlign: "center", fontSize: "12px", color: "#333a3f" }}>


        <b> @2022 Delicious. All Rights Reserved. Developed by: <a style={{color:'red',textDecoration:'underline'}} href="https://anurag.icu">anurag6569201</a></b>

      </p>

    </div>
  );
};

export default Footer;
