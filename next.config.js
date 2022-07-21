/** @type {import('next').NextConfig} */

const path = require('path');

const withTM = require('next-transpile-modules')(['gapi-script']);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = withTM(nextConfig);
