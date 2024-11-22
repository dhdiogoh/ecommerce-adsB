import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cart from "../../assets/cart.svg";
import logout from "../../assets/logout.svg";

export default function Header() {
	const [userName, setUserName] = useState("Anônimo"); // Inicia como "Anônimo"
	const [cartItemCount, setCartItemCount] = useState(0); // Estado para contar os itens no carrinho
	const navigate = useNavigate(); // Para redirecionar o usuário após o logout

	useEffect(() => {
		// Obtém o usuário logado do localStorage
		const loggedUser = localStorage.getItem("user_logado");
		if (loggedUser) {
			const user = JSON.parse(loggedUser); // Parse para objeto (se necessário)
			// Pega apenas a primeira palavra do nome
			const firstName = user.name ? user.name.split(" ")[0] : "Usuário";
			setUserName(firstName); // Define o primeiro nome ou fallback
		}

		// Verifica os itens no carrinho (products_list)
		const productsList = JSON.parse(localStorage.getItem("products_list")) || [];
		setCartItemCount(productsList.length); // Define a quantidade de itens no carrinho
	}, []);

	// Função para realizar o logout
	const handleLogout = () => {
		localStorage.removeItem("user_logado"); // Remove o usuário do localStorage
		navigate("/login"); // Redireciona para a página de login
	};

	return (
		<header className="bg-dark text-white py-3 shadow-lg">
			<div className="container d-flex justify-content-between align-items-center">
				{/* Logo */}
				<Link to="/" className="d-flex align-items-center text-decoration-none">
					<h4 className="text-warning mb-0">TechHub</h4>
				</Link>

				{/* Nome do Usuário */}
				<div>
					<h5 className="mb-0 text-center text-white-50">
						Bem-vindo, <span className="text-warning">{userName}</span>
					</h5>
				</div>

				{/* Carrinho de Compras e Logout */}
				<div className="d-flex align-items-center">
					<Link
						to="/carrinho" // Substitua pela rota do carrinho
						className="btn-warning text-dark position-relative me-3"
					>
						<img src={cart} alt="carrinho" />
						{/* Exibe a bolinha vermelha apenas se houver itens no carrinho */}
						{cartItemCount > 0 && (
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{cartItemCount}
							</span>
						)}
					</Link>

					{/* Link de Logout */}
					{userName !== "Anônimo" && (
						<Link
							to="#"
							onClick={handleLogout}
							className="text-danger text-decoration-none"
						>
							<img src={logout} alt="icon logout" />
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
