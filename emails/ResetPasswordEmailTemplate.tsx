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

interface ResetPasswordEmailTemplateProps {
    id?: string;
    userName?: string;
}
export const ResetPasswordEmailTemplate = ({
    id = "123456",
    userName,
}: ResetPasswordEmailTemplateProps) => (
    <Html>
        <Head />
        <Preview>Password Reset</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Your requested password reset</Heading>
                <Text style={{ fontWeight: "bold", fontSize: "20px" }}>
                    Hey {userName},
                </Text>
                <br />
                <Text style={text}>
                    Thank you for choosing GALLERY-STUDIO. Use the following link to reset your password for your account.
                </Text>
                <br />
                <Section>
                    <Text style={text}>You can reset your password from here:</Text>
                    <Link href={`http://localhost:3000/sign-in?ctxFP=true&ctxId=${id}`}>Reset</Link>
                </Section>
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
                        src={`https://utfs.io/f/E4wvAcFNKybhgy9WNzaEQawPBmHAt80lCfikIbVSU1scThzn`}
                        width="full"
                        height="full"
                        alt="Gallery-Studio's Logo"
                    />
                    <Text>
                        &copy; {new Date().getFullYear()} Gallery-Studio. All rights
                        reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

ResetPasswordEmailTemplate.PreviewProps = {
    userName: "John Doe",
    id: "123456",
} as ResetPasswordEmailTemplateProps;

export default ResetPasswordEmailTemplate;

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
    marginTop: "32px",
    marginBottom: "24px",
};
