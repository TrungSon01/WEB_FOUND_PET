import React from "react";
import "./NotFoundPage.css";
export default function NotFoundPage() {
  return (
    <div>
      <section className="page_error">
        <div className="container">
          <div className="row">
            <div className="page_error_animation">
              <h1>404</h1>
            </div>
            <p>Đã có gì sai sai xảy ra!</p>
            <a href="/" className="button">
              Quay về thôi
            </a>
          </div>
          <div className="row">
            <a href="https://olweb.com.br/" target="_blank">
              <img
                id="footer-logo"
                alt="Logo Olweb"
                src="https://olweb.com.br/media/shared-images/logo-olweb@250.png"
              />
            </a>
            <br />
            <a
              href="https://codepen.io/Navedkhan012/pen/vrWQMY"
              target="_blank"
              style={{ color: "#ccc", textDecoration: "none" }}
            >
              &gt;&gt; Original project
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
