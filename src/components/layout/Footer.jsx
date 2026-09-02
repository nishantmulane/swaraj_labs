function Footer() {
  return (
    <footer className="px-6 pb-5 pt-6 sm:px-10 lg:px-16">
      <div
        className="
          flex
          flex-col
          gap-2

          border-t
          border-line-soft

          pt-3

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            mono
            text-[7px]
            uppercase
            tracking-[0.16em]
            text-muted-soft
          "
        >
          Swaraj Labs
        </div>

        <div
          className="
            mono
            text-[7px]
            uppercase
            tracking-[0.14em]
            text-muted-soft
          "
        >
          Network Transmission Lab
        </div>
      </div>
    </footer>
  );
}

export default Footer;