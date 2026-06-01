const FacebookIcon = ({ title = "Facebook", ...props }) => (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>{title}</title>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ title = "Twitter", ...props }) => (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>{title}</title>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ title = "Instagram", ...props }) => (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>{title}</title>
    <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      <hr className="border border-gray-300 dark:border-gray-700" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold">QuickCart</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gian hàng một điểm đến cho mọi nhu cầu của bạn
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <a className="text-sm hover:underline" href="/about">
              Về Chúng Tôi
            </a>
            <a className="text-sm hover:underline" href="/contact">
              Liên Hệ
            </a>
            <a className="text-sm hover:underline" href="/privacy">
              Chính Sách Bảo Mật
            </a>
            <a className="text-sm hover:underline" href="/terms">
              Điều Khoản & Điều Kiện
            </a>
          </div>
        </div>

        {/* Social */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground"> Theo Dõi</p>
          <div className="flex justify-center gap-4 mt-2">
            <a
              aria-label="Facebook"
              className="hover:opacity-75 transition-opacity"
              href="https://facebook.com"
            >
              <FacebookIcon />
            </a>
            <a
              aria-label="Twitter"
              className="hover:opacity-75 transition-opacity"
              href="https://x.com"
            >
              <TwitterIcon />
            </a>
            <a
              aria-label="Instagram"
              className="hover:opacity-75 transition-opacity"
              href="https://instagram.com"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
