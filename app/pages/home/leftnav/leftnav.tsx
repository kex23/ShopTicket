import React, { useState } from "react";
import "./leftnav.css";
import DroiteIcons from "@/app/icons/flechedroite";
import GaucheIcons from "@/app/icons/flechegauche";

export default function LeftNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="contenuLeft">
      <div className="widthOuverture" style={{ width: isOpen ? '109%' : '20%' }}>
        <div className="ouverture" onClick={toggleNav}>
          {isOpen ? <GaucheIcons className="gauche" /> : <DroiteIcons className="droite" />}
        </div>
      </div>
      {isOpen && (
        <>
          <h3 className="TitreCategorie">Catégorie</h3>
          <ul className="ulCategorie">
            <li className="liCategorie">Pop</li>
            <li className="liCategorie">Evangelique</li>
            <li className="liCategorie">Rock</li>
          </ul>
        </>
      )}
    </div>
  );
}
