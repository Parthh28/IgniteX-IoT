import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  compact?: boolean;
}

export default function SocialLinks({ compact = false }: SocialLinksProps) {
  const iconSize = compact ? 16 : 18;
  const brandSize = compact ? 18 : 20;

  return (
    <div className={`${styles.list} ${compact ? styles.compact : ''}`}>
      <a
        href="https://www.instagram.com/ignitex.iot"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.instagram}`}
        aria-label="Instagram"
        title="Instagram"
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      </a>

      {/* Original multi-color Gmail M logo */}
      <a
        href="mailto:revaiotclub@gmail.com"
        className={`${styles.btn} ${styles.gmail}`}
        aria-label="Gmail IgniteX IoT Club"
        title="Gmail"
      >
        <svg
          width={brandSize}
          height={brandSize}
          viewBox="0 0 24 24"
          className={styles.brandSvg}
          aria-hidden="true"
        >
          <path fill="#4285F4" d="M22.56 19.636H19.636V9.273L12 15l-7.636-5.727v10.363H1.44A1.44 1.44 0 0 1 0 18.196V5.804a1.44 1.44 0 0 1 2.304-1.152L12 11.924l9.696-7.272A1.44 1.44 0 0 1 24 5.804v12.392a1.44 1.44 0 0 1-1.44 1.44z" />
          <path fill="#34A853" d="M19.636 19.636H22.56a1.44 1.44 0 0 0 1.44-1.44V9.273L19.636 12.545v7.091z" />
          <path fill="#FBBC05" d="M19.636 12.545 24 9.273V5.804a1.44 1.44 0 0 0-2.304-1.152L19.636 6.197v6.348z" />
          <path fill="#EA4335" d="M4.364 12.545V6.197L12 11.924l7.636-5.727v6.348L12 18.273l-7.636-5.728z" />
          <path fill="#C5221F" d="M0 9.273 4.364 12.545V6.197L2.304 4.652A1.44 1.44 0 0 0 0 5.804v3.469z" />
        </svg>
      </a>

      {/* Original WhatsApp logo */}
      <a
        href="https://chat.whatsapp.com/KsCvsjKfkRqD5wjFkK7paY?s=cl&p=a&iam=2"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.whatsapp}`}
        aria-label="WhatsApp Group"
        title="WhatsApp Group"
      >
        <svg
          width={brandSize}
          height={brandSize}
          viewBox="0 0 32 32"
          className={styles.brandSvg}
          aria-hidden="true"
        >
          <path
            fill="#25D366"
            d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.536.705 5.008 2.043 7.152L2.5 29.5l6.528-1.995A13.43 13.43 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5z"
          />
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 0C7.163 0 0 7.163 0 16c0 2.847.744 5.625 2.156 8.072L.182 31.305l7.434-1.948A15.92 15.92 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.774-1.855l-.486-.288-4.412 1.156 1.178-4.3-.316-.503A13.28 13.28 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z"
          />
          <path
            fill="#FFFFFF"
            d="M23.32 19.37c-.4-.2-2.37-1.17-2.737-1.304-.367-.133-.634-.2-.9.2-.267.4-1.034 1.304-1.268 1.57-.234.268-.467.3-.867.1-.4-.2-1.69-.623-3.22-1.988-1.19-1.061-1.993-2.372-2.227-2.772-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.234.267-.4.4-.668.133-.267.067-.5-.033-.7-.1-.2-.9-2.17-1.234-2.97-.325-.78-.655-.674-.9-.686l-.767-.014c-.267 0-.7.1-1.067.5-.367.4-1.4 1.37-1.4 3.337s1.434 3.87 1.634 4.137c.2.267 2.822 4.308 6.836 6.042.955.413 1.7.66 2.282.844.96.305 1.832.262 2.522.159.77-.115 2.37-.968 2.704-1.904.334-.934.334-1.736.234-1.904-.1-.167-.367-.267-.767-.467z"
          />
        </svg>
      </a>
    </div>
  );
}
