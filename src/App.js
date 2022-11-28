import './App.css';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Ranking from './components/Ranking';

const colors = {
	// TODO dark-mode theme
	brand: {
		green: '#496c50',
	},
	font: {
		primary: '#333',
		secondary: '#fff',
		accent: '#496c50',
	},
	background: {
		primary: '#fff',
		secondary: '#f7f4ef',
	},
};
const theme = extendTheme({ colors });

const Home = () => <div>Home page</div>;

function App() {
	return (
		<ChakraProvider theme={theme}>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					{/* <Route path="ranking" element={<Ranking />} /> */}
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}

export default App;
