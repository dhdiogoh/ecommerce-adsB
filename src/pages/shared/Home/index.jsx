import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const [products, setProducts] = useState([]); // Estado para armazenar os produtos
	const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
	const [error, setError] = useState(""); // Estado para lidar com erros
	const navigate = useNavigate(); // Para navegação em caso de não estar logado

	// Função para buscar os produtos
	useEffect(() => {
		axios
			.get("http://localhost:3000/products") // URL da API
			.then((response) => {
				setProducts(response.data); // Armazena os produtos no estado
				setLoading(false); // Atualiza o estado de carregamento
			})
			.catch((err) => {
				setError("Erro ao carregar produtos"); // Caso ocorra um erro
				setLoading(false); // Atualiza o estado de carregamento
			});
	}, []);

	// Função para adicionar produto ao localStorage
	const handleBuy = (product) => {
		// Verifica se o usuário está logado
		const loggedUser = localStorage.getItem("user_logado");
		if (!loggedUser) {
			// Caso o usuário não esteja logado, redireciona para o login
			navigate("/login");
			return;
		}

		// Recupera a lista de produtos no carrinho do localStorage
		const productList = JSON.parse(localStorage.getItem("products_list")) || [];

		// Verifica se o produto já está no carrinho
		const existingProductIndex = productList.findIndex(
			(item) => item.id === product.id,
		);

		if (existingProductIndex >= 0) {
			// Se o produto já estiver no carrinho, incrementa a quantidade
			productList[existingProductIndex].quantity += 1;
		} else {
			// Se o produto não estiver no carrinho, adiciona o produto com quantidade inicial de 1
			productList.push({ ...product, quantity: 1 });
		}

		// Salva a lista atualizada no localStorage
		localStorage.setItem("products_list", JSON.stringify(productList));
	};
	return (
		<>
			<Header />
			<div className="bg-black text-white min-vh-100 d-flex flex-column align-items-center py-5 pt-5">
				<h1 className="text-warning mb-5">Produtos em Destaque</h1>
				<div className="container">
					<div className="row g-4">
						{products.map((product) => (
							<div className="col-md-3" key={product.id}>
								<div className="card bg-dark text-white shadow-lg rounded-4">
									<img
										src={product.imgUrl} // Use o campo correto para a imagem
										alt="produto"
										className="card-img-top rounded-top-4"
									/>
									<div className="card-body">
										<h5 className="card-title text-warning text-truncate">
											{product.description}
										</h5>
										<p className="card-text text-white-50">
											R$ {product.price}
										</p>
										<button
											type="button"
											className="btn btn-warning text-dark w-100 rounded-3"
											onClick={() => handleBuy(product)} // Chama a função handleBuy ao clicar
										>
											Comprar
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
