import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Cart() {
	const [cartItems, setCartItems] = useState([]); 
	const [totalPrice, setTotalPrice] = useState(0); 
	const [paymentMethod, setPaymentMethod] = useState(""); 
	const navigate = useNavigate(); 

	useEffect(() => {
		const productsList = JSON.parse(localStorage.getItem("products_list")) || [];
		setCartItems(productsList);
		updateTotalPrice(productsList);
	}, []);

	const updateTotalPrice = (products) => {
		const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
		setTotalPrice(total);
	};

	const increaseQuantity = (productId) => {
		const updatedItems = cartItems.map((item) =>
			item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
		);
		setCartItems(updatedItems);
		localStorage.setItem("products_list", JSON.stringify(updatedItems));
		updateTotalPrice(updatedItems);
	};

    const decreaseQuantity = (productId) => {
        const updatedItems = cartItems.map((item) => {
            if (item.id === productId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }if (item.id === productId && item.quantity === 1) {
                return null;
            }
            return item;
        }).filter(item => item !== null); 
    
        setCartItems(updatedItems);
        localStorage.setItem("products_list", JSON.stringify(updatedItems));
        updateTotalPrice(updatedItems);
    };

	const handlePayment = async () => {
		const loggedUser = localStorage.getItem("user_logado");
		if (!loggedUser) {
			navigate("/login");
			return;
		}

		const user = JSON.parse(loggedUser); 
		const userId = user.id; 
		const userName = user.name; 
		const userZipCode = user.zipCode; 

		const order = {
			userId,
			userName,
			zipCode: userZipCode,
			products: cartItems,
			paymentMethod,
			totalPrice: totalPrice.toFixed(2),
		};

		try {
			const response = await axios.post("http://localhost:3000/orders", order);

			if (response.status === 201) {
				alert("Pagamento confirmado! Pedido realizado com sucesso.");
				
				localStorage.removeItem("products_list");
				setCartItems([]);
				updateTotalPrice([]);
				
				navigate("/"); 
			} else {
				alert('Houve um erro ao processar o pedido.');
			}
		} catch (error) {
			console.error(error);
			alert('Erro ao enviar o pedido. Tente novamente.');
		}
	};

	return (
		<div className="bg-black text-white min-vh-100 d-flex flex-column align-items-center py-5" style={{
			height: "100vh",
			width: "100vw",
			background: "linear-gradient(to right, #fdfbfb, #ebedee)",
		}}>
			<h1 className="text-primary mb-4">Seu carrinho</h1>
			<div className="container">
				<div className="row g-3">
					{cartItems.length > 0 ? (
						cartItems.map((product) => (
							<div className="col-3" key={product.id}>
								<div className="card bg-white text-white shadow-lg rounded-3">
									<div className="d-flex align-items-center flex-nowrap flex-column p-3">
										<img
											src={product.imgUrl}
											alt={product.description}
											className="rounded me-3"
											style={{ width: "80px", height: "80px", objectFit: "cover" }}
										/>
										<div className="flex-grow-1">
											<h5 className="mb-1 text-dark">{product.description}</h5>
											<p className="mb-1 text-dark">
												R$ {product.price.toFixed(2)} x {product.quantity} ={" "}
												<b className="text-primary">
													R$ {(product.price * product.quantity).toFixed(2)}
												</b>
											</p>
										</div>
										<div className="d-flex align-items-center">
											<button type="button"
												className="btn btn-sm btn-outline-primary me-2"
												onClick={() => decreaseQuantity(product.id)}
											>
												-
											</button>
											<span>{product.quantity}</span>
											<button type="button"
												className="btn btn-sm btn-outline-primary ms-2"
												onClick={() => increaseQuantity(product.id)}
											>
												+
											</button>
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-center mt-4">Seu carrinho está vazio</div>
					)}
				</div>

				<div className="mt-4">
					<h4 className="text-dark">Total: R$ {totalPrice.toFixed(2)}</h4>
				</div>

				<div className="mt-3">
					<h5>Forma de Pagamento</h5>
					<select
						className="form-select bg-white text-dark border-primary"
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
					>
						<option value="">Selecione...</option>
						<option value="credit_card">Cartão de Crédito</option>
						<option value="debit_card">Cartão de Débito</option>
						<option value="pix">Pix</option>
						<option value="bank_transfer">Boleto</option>
					</select>
				</div>

				<div className="mt-4">
					<button type="button"
						className="btn btn-primary w-100"
						onClick={handlePayment}
						disabled={!paymentMethod}
					>
						Confirmar Pagamento
					</button>
				</div>
			</div>
		</div>
	);
}
