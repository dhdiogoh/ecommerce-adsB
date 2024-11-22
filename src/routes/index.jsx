import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/shared/Home";
import Register from "../pages/shared/register";
import Login from "../pages/shared/login";
import Cart from "../pages/client/Cart";
import RegisterProducts from "../pages/admin/RegisterProducts";
import ListOrders from "../pages/admin/ListOrders";
import NotFound from "../pages/NotFound"; // Página de erro para acesso negado
import ModAdmin from "../components/ModAdmin";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/cadastro",
		element: <Register /> ,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/carrinho",
		element: <PrivateRoute component={<Cart />} />,
	},
	{
		path: "/admin/criarProduto",
		element: <PrivateRoute component={<RegisterProducts />} isAdminRequired={true} />,
	},
	{
		path: "/admin/ListarPedidos",
		element: <PrivateRoute component={<ListOrders />} isAdminRequired={true} />,
	},
	{
		// Página de erro de "Acesso Negado"
		path: "/notfound",
		element: <NotFound />,
	},
]);

// Função que gerencia o acesso às páginas, verificando o status de login e permissões
function PrivateRoute({ component, isAdminRequired }) {
	const user = JSON.parse(localStorage.getItem("user_logado")); // Verifica se o usuário está logado

	// Se não estiver logado, redireciona para a página de login
	if (!user) {
		return <Navigate to="/login" />;
	}

	// Se for uma página de admin e o usuário não for admin, redireciona para a página de erro
	if (isAdminRequired && !user.isAdmin) {
		return <Navigate to="/notfound" />;
	}

	// Se passar nas verificações, renderiza o componente e o ModAdmin (se for admin)
	return (
		<>
			{/* Renderiza o ModAdmin apenas para administradores */}
			{user.isAdmin && <ModAdmin />}
			{component}
		</>
	);
}

export default routes;
