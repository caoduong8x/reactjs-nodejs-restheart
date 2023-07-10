import React from "react";
import { APP_NAME } from "../../../../../../config";

function Footer({ ...props }) {
  return (
    <footer className='footer'>
      <div className='left'>
        {/* Bộ tư lệnh 86 - BQP */}
      </div>
      <p className='right'>
        <span>
        <a href="#" target='_blank' >
            {APP_NAME} &copy; {1900 + new Date().getYear()}{" "}
          </a>
        </span>
      </p>
    </footer>
  );
}

export default Footer;
