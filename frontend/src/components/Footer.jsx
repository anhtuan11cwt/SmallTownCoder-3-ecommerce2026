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
    <footer className="w-full mt-auto print:hidden px-6 md:px-16 lg:px-24 xl:px-32">
      <hr className="border border-border" />
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 text-muted-foreground">
        {/* Brand */}
        <div className="max-w-[410px]">
          <h2 className="text-xl font-bold text-foreground">QuickCart</h2>
          <p className="text-sm mt-4">
            Gian hàng một điểm đến cho mọi nhu cầu của bạn
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          <div>
            <h3 className="font-semibold text-base text-foreground md:mb-5 mb-2">
              Liên Kết
            </h3>
            <ul className="text-sm space-y-1.5">
              <li>
                <a className="hover:underline transition" href="/about">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/contact">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/privacy">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/terms">
                  Điều Khoản
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground md:mb-5 mb-2">
              Theo Dõi
            </h3>
            <div className="flex gap-3 mt-2 md:mt-0">
              <a
                aria-label="Facebook"
                className="hover:text-foreground transition-colors"
                href="https://facebook.com"
              >
                <FacebookIcon />
              </a>
              <a
                aria-label="Twitter"
                className="hover:text-foreground transition-colors"
                href="https://x.com"
              >
                <TwitterIcon />
              </a>
              <a
                aria-label="Instagram"
                className="hover:text-foreground transition-colors"
                href="https://instagram.com"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr className="border border-border" />
      <p className="py-4 text-center text-sm text-muted-foreground/80">
        &copy; {new Date().getFullYear()} QuickCart. Tất cả quyền được bảo lưu.
      </p>
    </footer>
  );
};

export default Footer;
