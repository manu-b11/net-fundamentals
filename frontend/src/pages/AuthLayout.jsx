function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <svg
            width="30"
            height="30"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="18" cy="18" r="16" fill="#17303A" />
            <path
              d="M9 23.5h5.5V12.5H9m12.5 0h5.5v11h-5.5M14.5 18h7"
              stroke="#4FD1A5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="18" r="2.2" fill="#FF7A50" />
            <circle cx="24" cy="18" r="2.2" fill="#4FD1A5" />
          </svg>
          <span>NetFundamentals</span>
        </div>

        <svg
          className="auth-wire"
          viewBox="0 0 320 18"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle cx="6" cy="9" r="4" fill="#4FD1A5" />
          <circle cx="314" cy="9" r="4" fill="#FF7A50" />
          <path
            d="M6,9 C90,-4 230,22 314,9"
            fill="none"
            stroke="#2A4A56"
            strokeWidth="1.4"
          />
        </svg>

        <h1>{title}</h1>
        {subtitle && <p className="auth-sub">{subtitle}</p>}

        {children}

        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </div>
  );
}

export default AuthLayout;
