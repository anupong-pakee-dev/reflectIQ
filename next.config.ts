import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling Node.js-only packages.
  // Required for nodemailer (uses net/tls) and bcryptjs on Vercel.
  serverExternalPackages: ["nodemailer", "bcryptjs"],
};

export default nextConfig;
