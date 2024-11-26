import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import facebookIcon from "../../assets/facebook.svg";
import twitterIcon from "../../assets/twitter.svg";
import instagramIcon from "../../assets/instagram.svg";

export default function HeaderAndFooter() {
	const [userName, setUserName] = useState("Anônimo");
	const [cartItemCount, setCartItemCount] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const loggedUser = localStorage.getItem("user_logado");
		if (loggedUser) {
			const user = JSON.parse(loggedUser);
			const firstName = user.name ? user.name.split(" ")[0] : "Usuário";
			setUserName(firstName);
		}

		const productsList =
			JSON.parse(localStorage.getItem("products_list")) || [];
		setCartItemCount(productsList.length);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user_logado");
		navigate("/login");
	};

	return (
		<div className="bg bg-light d-flex flex-column min-vh-100 justify-content-between">
			{/* Header */}
			<header className="bg-light text-white py-2 shadow">
				<div className="container d-flex py-2 justify-content-between align-items-center gap-2">
					{/* Logo */}
					<Link to="/" className="text-decoration-none">
						<h3 className="text-primary fs-4 mb-0">StepUp</h3>
					</Link>

					{/* Nome do Usuário */}
					<div>
						<h5 className="mb-0 text-white-50 text-center">
							 <span className="text-primary">{userName}</span>
						</h5>
					</div>

					{/* Carrinho e Logout */}
					<div className="cart d-flex align-items-center gap-3">
						<Link
							to="/carrinho"
							className="btn btn-primary position-relative px-4"
						>
							Carrinho
							{cartItemCount > 0 && (
								<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
									{cartItemCount}
								</span>
							)}
						</Link>
						{userName !== "Anônimo" && (
							<button
								type="button"
								onClick={handleLogout}
								className="btn btn-outline-danger px-4"
							>
								Logout
							</button>
						)}
					</div>
				</div>
			</header>

			{/* Footer */}
			<footer className="bg-light text-dark py-4">
				<div className="container">
					<div className="gb row text-center ">
						{/* Links Rápidos */}
						<div className="col-md-4 mb-3 redes">
							<h5 className="text-primary fs-6">Links Rápidos</h5>
							<ul className="list-unstyled">
								<li>
									<Link to="/sobre" className="text-black text-decoration-none">
										Sobre Nós
									</Link>
								</li>
								<li>
									<Link
										to="/contato"
										className="text-black text-decoration-none"
									>
										Contato
									</Link>
								</li>
								<li>
									<Link
										to="/politica-de-privacidade"
										className="text-black text-decoration-none"
									>
										Política de Privacidade
									</Link>
								</li>
							</ul>
						</div>

						{/* Contato */}
						<div className="col-md-4 mb-3 redes">
							<h5 className="text-primary fs-6">Contato</h5>
							<ul className="list-unstyled">
								<li>
									<a
										href="tel:+5511999999999"
										className="text-black text-decoration-none"
									>
										(11) 99999-9999
									</a>
								</li>
							</ul>
						</div>

						{/* Redes Sociais */}
						<div className="col-md-3 mb-3 redes">
							<h5 className="text-primary fs-6">Redes Sociais</h5>
							<div className="d-flex justify-content-center ">
								<a
									href="https://www.facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="me-3"
								>
									<img
										src={facebookIcon}
										alt="Facebook"
										style={{ width: "24px", height: "24px" }}
									/>
								</a>
								<a
									href="https://www.twitter.com"
									target="_blank"
									rel="noopener noreferrer"
									className="me-3"
								>
									<img
										src={twitterIcon}
										alt="Twitter"
										style={{ width: "24px", height: "24px" }}
									/>
								</a>
								<a
									href="https://www.instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="me-3"
								>
									<img
										src={instagramIcon}
										alt="Instagram"
										style={{ width: "24px", height: "24px" }}
									/>
								</a>
							</div>
						</div>
					</div>

					{/* Copyright */}
					<div className="text-center mt-3">
						<p className="mb-0 text-dark">
							&copy; {new Date().getFullYear()} StepUp. Todos os direitos
							reservados.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
