# 🌟 Socialure

A modern, full-stack social media platform built with Next.js 15, featuring real-time interactions, user authentication, and a beautiful glassmorphism UI design.

![Socialure Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748)

## ✨ Features

### 🔐 Authentication & User Management

- **Clerk Authentication** - Secure user authentication with social logins
- **User Profiles** - Customizable profiles with bio, location, and website
- **Avatar Upload** - Profile picture management with UploadThing
- **Follow System** - Follow/unfollow users with real-time updates

### 📱 Social Features

- **Post Creation** - Rich text posts with image uploads
- **Real-time Feed** - Dynamic home feed with latest posts
- **Comments System** - Nested comments on posts
- **Notifications** - Real-time notifications for interactions
- **User Discovery** - "Who to Follow" recommendations

### 🎨 Modern UI/UX

- **Glassmorphism Design** - Beautiful glass-like UI components
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Mobile-first responsive layout
- **Green Color Palette** - Modern green/black/gray theme (#61892F, #86c232, #222629, #6b6e70)
- **Smooth Animations** - Elegant transitions and hover effects

### 🚀 Performance & Architecture

- **Next.js 15** - Latest Next.js with App Router
- **Server Components** - Optimized rendering with RSC
- **TypeScript** - Type-safe development
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Theme**: next-themes

### Backend

- **Database**: PostgreSQL
- **ORM**: Prisma 6.9.0
- **Authentication**: Clerk
- **File Upload**: UploadThing
- **API**: Next.js API Routes

### Development Tools

- **Package Manager**: npm
- **Code Quality**: ESLint
- **Database Migration**: Prisma Migrate

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication
- UploadThing account for file uploads

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NishantRaj278/Socialure.git
   cd socialure
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/socialure"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
socialure/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── actions/              # Server actions
│   │   ├── notification.action.ts
│   │   ├── post.action.ts
│   │   ├── profile.action.ts
│   │   └── user.action.ts
│   ├── app/                  # App Router pages
│   │   ├── api/             # API routes
│   │   ├── notifications/   # Notifications page
│   │   ├── profile/         # User profiles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   ├── CreatePost.tsx
│   │   ├── PostCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── lib/                # Utilities
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # Helper functions
│   └── utils/
│       └── uploadthing.ts  # Upload configuration
├── components.json          # shadcn/ui config
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Color Palette

- **Primary Green**: `#61892F` - Main brand color
- **Accent Green**: `#86c232` - Highlights and CTAs
- **Dark Gray**: `#222629` - Text and backgrounds
- **Light Gray**: `#6b6e70` - Secondary text and borders

### Components

- **Cards**: Glassmorphism effect with subtle gradients
- **Buttons**: Green gradients with hover animations
- **Forms**: Clean inputs with green focus states
- **Navigation**: Responsive design with mobile drawer

## 📱 Features Overview

### Home Feed

- Real-time post updates
- Infinite scroll loading
- Post creation with image upload
- Like and comment functionality

### User Profiles

- Customizable profile information
- Post history and statistics
- Follow/following counts
- Responsive design

### Notifications

- Real-time notification system
- Mark as read functionality
- Clean, organized layout

### Authentication

- Social login options
- Secure session management
- Protected routes

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma migrate dev    # Run database migrations
npx prisma generate      # Generate Prisma client
npx prisma studio       # Open Prisma Studio

# Code Quality
npm run lint        # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Database Setup

- Use Vercel Postgres, PlanetScale, or any PostgreSQL provider
- Update `DATABASE_URL` in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication & User Management
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com/) - Low-level UI primitives
- [UploadThing](https://uploadthing.com/) - File upload solution

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainer.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/NishantRaj278">Nishant Raj</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
