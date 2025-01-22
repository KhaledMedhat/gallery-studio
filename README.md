# will remove later 

# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.

# Drizzle
DATABASE_URL='postgresql://gallery-studio_owner:KJGhasVuTp75@ep-cold-pond-a5gopzxz.us-east-2.aws.neon.tech/gallery-studio?sslmode=require'

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
# NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="7wr3LMqqyYxszQvAJ0eWo2k1W02rMX5hjStNsUt1KWg="

# Next Auth Google Provider
GOOGLE_CLIENT_ID='662893226717-eguc8qrjojhjtgp7ie7krbmhsksddvo4.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET='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'

# Next Auth Twitter Proivder

TWITTER_CLIENT_ID='bHAtNHNpVTMwQ3BDalRXSHRfVVg6MTpjaQ'
TWITTER_CLIENT_SECRET='av0SpnTyaL5r9c8WM-u0krIBVumbG9SlD3x4n-3RTyUSL6Vxar'

# Resend
RESEND_API_KEY='re_Fd5rhS8q_2QZdCazDu53ypSacstJ5a5PL'

# Uploadthing
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZlX2Q2ZWNiZDkwYWJhZjM1YTMxYmYxZmZiMDdiMzQzOTEzOWI1NDYyZTI4YjVmNDJhNzJiNDEwYzA2Njg0MDgxZmUiLCJhcHBJZCI6ImxoNG52ZnlyNWQiLCJyZWdpb25zIjpbInNlYTEiXX0='

# Encryption Secret Key

NEXT_PUBLIC_ENCRYPTION_SECRET_KEY='gallerystudiosecretkeyencryption'






# Gallery-Studio

**Gallery-Studio** is a social media application similar to Instagram, designed to provide users with a personal gallery where they can upload and manage their images. Each user has the option to make their images private or public. Public images are featured on a showcases page, visible to any user who follows the image owner.

## Features
- **User Galleries**: Each user has a dedicated gallery to upload and organize their images.
- **User Profile**: Each user has a profile page that anyone can link to it once they press on @(his name).
- **Privacy Control**: Users can set their images to private or public.
- **Showcases Page**: Public images are displayed on a showcases page, accessible to followers of the image owner.
- **Follow System**: Users can follow others to see their public images on the showcases page.
- **Feedback System**: Users can add their feedbacks for the website and be shown in the home or feedback page.
- **Album**: Users can create albums for themselves to add their favourite images / videos in it.
- **Interaction System**: Users can comment or like on others images / videos if they follows them and the image/ video set to public.
- **Signin in/up**: User can create their own account or use other providers such as X or Google to login with.

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/KhaledMedhat/gallery-studio.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd Gallery-Studio
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Run the application**:
    ```bash
    npm start
    ```

## Usage
1. **Sign Up**: Create a new account or log in with existing credentials.
2. **Upload Images**: Upload images to your personal gallery.
3. **Set Privacy**: Choose to make your images private or public.
4. **Explore Showcases**: View public images on the showcases page by following other users.


---
