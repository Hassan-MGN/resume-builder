import { Link } from "react-router-dom";

const Brand = ({ dark = false, className = "", markClassName = "h-8 w-8", textClassName = "font-bold tracking-[-.02em]" }) => (
  <Link to="/" className={`inline-flex items-center gap-2.5 shrink-0 ${className}`} aria-label="Resummetry home">
    <img
      src={dark ? "/resummetry-mark-white.svg" : "/resummetry-mark.svg"}
      alt=""
      aria-hidden="true"
      className={`shrink-0 object-contain ${markClassName}`}
    />
    <span className={textClassName}>Resummetry</span>
  </Link>
);

export default Brand;
