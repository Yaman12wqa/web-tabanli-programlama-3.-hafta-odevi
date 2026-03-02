const Footer = () => {
    return (
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container text-center text-sm text-gray">
                &copy; {new Date().getFullYear()} BEUBlog. Eğitim amaçlı geliştirilmiştir. Tüm hakları saklıdır.
            </div>
        </footer>
    );
};

export default Footer;
