import React, { useState } from "react";
import { Link } from "react-router-dom";
import engrenagem from "../../assets/engrenagem.svg"


export default function ModAdmin() {
  const [showOptions, setShowOptions] = useState(false); 
  return (
    <div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className={`btn btn-primary rounded-circle position-fixed d-flex justify-content-center align-items-center p-3 ${
          showOptions ? "active" : ""
        }`}
        style={{
          bottom: "20px",
          left: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          zIndex: 9999, 
        }}
        onClick={() => setShowOptions(!showOptions)} 
      >
        Admin
      </div>

      {showOptions && (
        <div
          className="bg-primary rounded position-fixed d-flex flex-column align-items-end"
          style={{ bottom: "80px", left: "20px", gap: "10px", zIndex: 9999 }}
        >
          <Link to="/cadastrar_produto" className="btn btn-primary btn-lg">
            cadastrar produto
          </Link>
          <Link to="/visualizar_produto" className="btn btn-primary btn-lg">
            visualizar pedidos
          </Link>
        </div>
      )}
    </div>
  );
}
