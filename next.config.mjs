/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/disciscover',
        destination: '/discover',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
