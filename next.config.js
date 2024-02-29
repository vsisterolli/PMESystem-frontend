/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
        return {
            fallback: [
                {
                    source: "/:path*",
                    destination: "/home"
                }
            ]
        };
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.habbo.com.br",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "pmesystem.s3.sa-east-1.amazonaws.com",
                port: "",
                pathname: "/**"
            }
        ]
    }
};
