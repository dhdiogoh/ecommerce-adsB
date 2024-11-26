import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAndFooter from "../../../components/HeaderAndFooter";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get("http://localhost:3000/products")
			.then((response) => {
				setProducts(response.data);
				setLoading(false);
			})
			.catch((err) => {
				setError("Erro ao carregar produtos");
				setLoading(false);
			});
	}, []);

	const handleBuy = (product) => {
		const loggedUser = localStorage.getItem("user_logado");
		if (!loggedUser) {
			navigate("/login");
			return;
		}

		const productList = JSON.parse(localStorage.getItem("products_list")) || [];

		const existingProductIndex = productList.findIndex(
			(item) => item.id === product.id
		);

		if (existingProductIndex >= 0) {
			productList[existingProductIndex].quantity += 1;
		} else {
			productList.push({ ...product, quantity: 1 });
		}

		localStorage.setItem("products_list", JSON.stringify(productList));
	};

	return (
		<>
			<HeaderAndFooter />
			<div className=" min-vh-100 d-flex flex-column align-items-center py-5"
			
			style={{
				height: "100vh",
				width: "100vw",
				background: "linear-gradient(to right, #f0f0f0, #ebedee)",
			}}>
				<h1 className="text-primary mb-5">Nossos Produtos</h1>
				<div className="container">
					{loading ? (
						<p>Carregando...</p>
					) : error ? (
						<p className="text-danger">{error}</p>
					) : (
						<div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
							{products.map((product) => (
								<div className="col" key={product.id}>
									<div className="card h-100 border-0 shadow-sm">
										<div className="card-img-top d-flex justify-content-center align-items-center bg-light p-2" style={{ height: "150px" }}>
											<img
												src={product.imgUrl}
												alt={product.description}
												style={{
													maxHeight: "100%",
													maxWidth: "100%",
													objectFit: "contain",
												}}
											/>
										</div>
										<div className="card-body text-center">
											<h6 className="card-title text-truncate">{product.description}</h6>
											<p className="text-muted mb-2">R$ {product.price}</p>
											<button type="button"
												className="btn btn-primary btn-sm"
												onClick={() => handleBuy(product)}
											>
												Comprar
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
