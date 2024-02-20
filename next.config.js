/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.habbo.com.br",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.imgur.com",
                port: "",
                pathname: "/**",
            }
        ],
    },
};

