import { Link } from "react-router-dom";
import { UNIVERSITY } from "../utils/constants";

const Footer = () => {
  return (
    <footer className="mt-8 bg-white border-t border-borderLight">
      <div className="py-5 container-page">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-textPrimary">M Hub</h3>
            <p className="mt-1 text-xs text-textSecondary">
              {UNIVERSITY.name} study resources platform for PYQs and notes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-textPrimary">
              Quick Links
            </h4>
            <ul className="space-y-1 text-xs text-textSecondary">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pyqs" className="hover:text-primary">
                  PYQs
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-primary">
                  Materials
                </Link>
              </li>
              <li>
                <Link to="/organizers" className="hover:text-primary">
                  Organizers
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-textPrimary">
              About
            </h4>
            <p className="text-xs text-textSecondary">
              Helping students under {UNIVERSITY.shortName} access resources
              easily.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-borderLight" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <p className="text-[11px] text-textSecondary">
            © {new Date().getFullYear()} M Hub · {UNIVERSITY.shortName}
          </p>

          <div className="flex gap-3 text-[11px] text-textSecondary">
            <span className="cursor-pointer hover:text-primary">Privacy</span>
            <span className="cursor-pointer hover:text-primary">Terms</span>
            <span className="cursor-pointer hover:text-primary">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
