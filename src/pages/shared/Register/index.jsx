import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		cepCode: "",
		birthDate: "",
		isAdmin: false,
	});

	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const emailCheckResponse = await axios.get(
				`http://localhost:3000/users?email=${formData.email}`,
			);
			if (emailCheckResponse.data.length > 0) {
				setError("Este email já está registrado.");
				return;
			}
		} catch (error) {
			setError("Erro ao verificar email.");
			return;
		}

		try {
			const cepResponse = await axios.get(
				`https://viacep.com.br/ws/${formData.cepCode}/json/`,
			);
			if (cepResponse.data.erro) {
				setError("CEP inválido.");
				return;
			}
		} catch (error) {
			console.error("Erro ao verificar CEP:", error);
			setError("Erro ao verificar CEP.");
			return;
		}

		const birthDate = new Date(formData.birthDate);
		const age = new Date().getFullYear() - birthDate.getFullYear();
		const monthDiff = new Date().getMonth() - birthDate.getMonth();
		if (age < 18 || (age === 18 && monthDiff < 0)) {
			setError("A idade mínima para cadastro é 18 anos.");
			return;
		}

		axios
			.post("http://localhost:3000/users", formData)
			.then((response) => {
				alert("Registro concluído!");
				navigate("/login");
			})
			.catch((error) => {
				console.log(error);

				alert("Houve um erro ao enviar os dados.");
			});
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{
				height: "100vh",
				width: "100vw",
				background: "linear-gradient(to right, #fdfbfb, #ebedee)",
			}}
		>
			<div className="col-md-4">
				<div className="card shadow-lg p-4 bg-white text-dark rounded-4">
					<h3 className="text-center mb-4 text-primary">Crie sua Conta</h3>
					<p className="text-center text-muted">
						Preencha os dados abaixo para começar a explorar nossa loja de
						sapatos!
					</p>
					{error && <div className="alert alert-danger">{error}</div>}
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<input
								type="text"
								name="name"
								className="form-control bg-light text-dark border shadow-sm rounded-3 py-2 px-3 mb-3"
								placeholder="Nome Completo"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<input
								type="email"
								name="email"
								className="form-control bg-light text-dark border shadow-sm rounded-3 py-2 px-3 mb-3"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3">
							<input
								type="password"
								name="password"
								className="form-control bg-light text-dark border shadow-sm rounded-3 py-2 px-3 mb-3"
								placeholder="Senha"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="mb-3 d-flex ">
							<input
								type="text"
								name="cepCode"
								className="form-control bg-light text-dark border shadow-sm rounded-3 py-2 px-3 mb-3"
								placeholder="CEP"
								value={formData.cepCode}
								onChange={handleChange}
								required
							/>
							<input
								type="date"
								name="birthDate"
								className="form-control bg-light text-dark border shadow-sm rounded-3 py-2 px-3 mb-3"
								value={formData.birthDate}
								onChange={handleChange}
								required
							/>
						</div>

						<button
							type="submit"
							className="btn w-100 btn-primary text-white font-weight-bold py-2 rounded-3"
						>
							Registrar
						</button>
						<p className="mt-3 text-center">
							Já possui conta?{" "}
							<Link to="/login" className="text-primary fw-bold">
								Clique aqui
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
