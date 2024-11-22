import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import axios from 'axios'; // Importando o Axios

export default function Cart() {
	const [cartItems, setCartItems] = useState([]); // Estado para armazenar os itens do carrinho
	const [totalPrice, setTotalPrice] = useState(0); // Estado para armazenar o total do carrinho
	const [paymentMethod, setPaymentMethod] = useState(""); // Estado para armazenar o método de pagamento
	const navigate = useNavigate(); // Para navegação

	// Carrega os itens do carrinho quando o componente é montado
	useEffect(() => {
		const productsList = JSON.parse(localStorage.getItem("products_list")) || [];
		setCartItems(productsList);
		updateTotalPrice(productsList);
	}, []);

	// Função para atualizar o preço total do carrinho
	const updateTotalPrice = (products) => {
		const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
		setTotalPrice(total);
	};

	// Função para aumentar a quantidade de um produto
	const increaseQuantity = (productId) => {
		const updatedItems = cartItems.map((item) =>
			item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
		);
		setCartItems(updatedItems);
		localStorage.setItem("products_list", JSON.stringify(updatedItems));
		updateTotalPrice(updatedItems);
	};

	// Função para diminuir a quantidade de um produto
    const decreaseQuantity = (productId) => {
        const updatedItems = cartItems.map((item) => {
            if (item.id === productId && item.quantity > 1) {
                // Decrementa a quantidade
                return { ...item, quantity: item.quantity - 1 };
            }if (item.id === productId && item.quantity === 1) {
                // Remove o produto completamente quando a quantidade chega a 1
                return null; // Retorna null para remover o produto
            }
            return item;
        }).filter(item => item !== null); // Filtra os nulos (produtos removidos)
    
        // Atualiza os itens no carrinho e no localStorage
        setCartItems(updatedItems);
        localStorage.setItem("products_list", JSON.stringify(updatedItems));
    
        updateTotalPrice(updatedItems);
    };

	// Função para concluir o pagamento
	const handlePayment = async () => {
		// Verifica se o usuário está logado
		const loggedUser = localStorage.getItem("user_logado");
		if (!loggedUser) {
			// Se não estiver logado, redireciona para o login
			navigate("/login");
			return;
		}

		// Recupera os dados do usuário e do carrinho
		const user = JSON.parse(loggedUser); // Supondo que o usuário esteja salvo como objeto no localStorage
		const userId = user.id; // ID do usuário
		const userName = user.name; // Nome do usuário
		const userZipCode = user.zipCode; // CEP do usuário (ajuste conforme onde estiver armazenado)

		// Cria o payload do pedido
		const order = {
			userId,
			userName,
			zipCode: userZipCode,
			products: cartItems,
			paymentMethod,
			totalPrice: totalPrice.toFixed(2),
		};

		try {
			// Faz a requisição para a API com Axios
			const response = await axios.post("http://localhost:3000/orders", order);

			// Verifica se a requisição foi bem-sucedida
			if (response.status === 201) {
				// Exibe uma mensagem de sucesso
				alert("Pagamento confirmado! Pedido realizado com sucesso.");
				
				// Limpa o carrinho e os dados do localStorage
				localStorage.removeItem("products_list");
				setCartItems([]);
				updateTotalPrice([]);
				
				// Redireciona para a página inicial ou outra página de sua escolha
				navigate("/"); 
			} else {
				// Se não for bem-sucedido, exibe um erro
				alert('Houve um erro ao processar o pedido.');
			}
		} catch (error) {
			// Em caso de erro na requisição
			console.error(error);
			alert('Erro ao enviar o pedido. Tente novamente.');
		}
	};

	return (
		<>
			<Header />
			<div className="bg-black text-white min-vh-100 d-flex flex-column align-items-center py-5 pt-5">
				<h1 className="text-warning mb-5">Carrinho de Compras</h1>
				<div className="container">
					{/* Layout flex-column para os produtos com 100% de largura */}
					<div className="row g-4">
						{cartItems.length > 0 ? (
							cartItems.map((product) => (
								<div className="col-md-12" key={product.id}>
									<div className="card bg-dark text-white shadow-lg rounded-4">
										<div className="row g-0">
											{/* Imagem com altura e largura ajustada */}
											<div className="col-md-2">
												<img
													src={product.imgUrl}
													alt={product.description}
													className="img-fluid rounded-start h-100 w-100"
												/>
											</div>

											<div className="col-md-10">
												<div className="card-body d-flex flex-column justify-content-between">
													<h5 className="card-title text-warning">
														{product.description}
													</h5>
													<p className="card-text text-white-50">
														R$ {product.price} x {product.quantity} = <b className="text-warning">R$ {(product.price * product.quantity).toFixed(2)}</b>
													</p>

													{/* Ações de aumentar e diminuir a quantidade */}
													<div className="d-flex justify-content-start align-items-center">
														<button
															type="button"
															className="btn btn-transpararent btn-sm fs-2 text-warning"
															onClick={() => decreaseQuantity(product.id)}
														>
															-
														</button>
														<span className="text-white ms-3 me-3">{product.quantity}</span>
														<button
															type="button"
															className="btn btn-transpararent btn-sm fs-2 text-warning"
															onClick={() => increaseQuantity(product.id)}
														>
															+
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-white">Carrinho vazio</div>
						)}
					</div>

					{/* Exibição do total */}
					<div className="mt-4 text-white">
						<h4 className="text-warning">Total: R$ {totalPrice.toFixed(2)}</h4>
					</div>

					{/* Opções de pagamento */}
					<div className="mt-4 text-white">
						<h5>Escolha a forma de pagamento:</h5>
						<select
							className="form-select"
							value={paymentMethod}
							onChange={(e) => setPaymentMethod(e.target.value)}
						>
							<option value="">Selecione...</option>
							<option value="credit_card">Cartão de Crédito</option>
							<option value="debit_card">Cartão de Debito</option>
							<option value="pix">Pix</option>
							<option value="bank_transfer">Boleto</option>
						</select>
					</div>

					{/* Botão de confirmar pagamento */}
					<div className="mt-4">
						<button
							type="button"
							className="btn btn-warning w-100"
							onClick={handlePayment}
							disabled={!paymentMethod}
						>
							Confirmar Pagamento
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
