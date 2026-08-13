function Footer() {
  return (
    <footer
      className="
        mx-6
        mt-10

        flex
        items-center
        justify-between

        border-t
        border-line-soft

        py-5

        mono

        text-[8px]
        uppercase
        tracking-[0.16em]

        text-muted

        sm:mx-10
        sm:text-[9px]

        lg:mx-16
      "
    >
      <span>
        Protocol: Local
      </span>

      <span>
        Connection: Direct
      </span>
    </footer>
  );
}

export default Footer;