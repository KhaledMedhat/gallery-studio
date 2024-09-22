import {
    Body,
    Container,
    Text,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Hr,
  } from "@react-email/components";
  
  interface GalleryStudioVerifyOTPProps {
    OTPCode?: string;
    userName?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  export const GalleryStudioVerifyOTPEmail = ({
    OTPCode = "123456",
    userName,
  }: GalleryStudioVerifyOTPProps) => (
    <Html>
      <Head />
      <Preview>Sign up OTP Verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your requested OTP</Heading>
          <Text style={{ fontWeight: "bold", fontSize: "20px" }}>
            Hey {userName},
          </Text>
          <br />
          <Text style={text}>
            Thank you for choosing GALLERY-STUDIO. Use the following OTP to
            complete the procedure to create your account. OTP is valid for 5
            minutes. Do not share this code with others.
          </Text>
          <br />
          <Section>
            <Text style={code}>{OTPCode}</Text>
          </Section>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Text style={help}>
            If you need any assistance, please visit our
            <Link style={link}> Help Center</Link>.
          </Text>
          <Hr />
          <Section style={footer}>
            <Img
              style={logo}
              src={`${baseUrl}/static/gallery-studio-logo.svg`}
              width="250"
              height="100"
              alt="Gallery-Studio's Logo"
            />
            <Text style={{ fontWeight: "bold" , fontSize: '24px', paddingBottom: '16px'}}>GALLERY-STUDIO</Text>
            <Text>
              &copy; {new Date().getFullYear()} Gallery-Studio. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  GalleryStudioVerifyOTPEmail.PreviewProps = {
    userName: "John Doe",
    OTPCode: "123456",
  } as GalleryStudioVerifyOTPProps;
  
  export default GalleryStudioVerifyOTPEmail;
  
  const main = {
    backgroundColor: "#ffffff",
    color: "#171717",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  };
  
  const container = {
    padding: "12px",
    margin: "0 auto",
    textAlign: "center" as const,
  };
  
  const h1 = {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
  };
  
  const link = {
    color: "#3b82f6",
    fontWeight: "bold",
    textDecoration: "underline",
  };
  
  const text = {
    fontSize: "18px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const help = {
    fontSize: "18px",
    paddingTop: "10px",
    paddingBottom: "10px",
  };
  
  const footer = {
    margin: "0 auto",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "12px",
    marginBottom: "24px",
  };
  
  const code = {
    color: "#3b82f6",
    display: "inline-block",
    fontSize: "46px",
    fontWeight: 700,
    letterSpacing: "26px",
    lineHeight: "40px",
    paddingBottom: "8px",
    paddingTop: "8px",
    margin: "0 auto",
    width: "100%",
    textAlign: "center" as const,
  };
  