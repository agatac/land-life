import './App.css';
import { extendTheme, Box, ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Ranking from './components/Ranking';
import Species from './components/Species';
import parseCsv from './util/parseCsv';

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

const Home = () => <Box m="8">Rough frontend drafted for the assignment.</Box>;

function App() {
	// Preferably this would be TS
	const [species, setSpecies] = useState([]);
	const [fieldData, setFieldData] = useState([]);

	useEffect(() => {
		// TODO error handle (no file in /data, invalid format etc)
		Promise.all([fetch('./data/species.csv'), fetch('./data/field_data.csv')])
			.then(([s, d]) => Promise.all([s.text(), d.text()]))
			.then(([s, d]) => {
				setSpecies(parseCsv(s));
				setFieldData(parseCsv(d, ';'));
			});
	}, []);

	return (
		<ChakraProvider theme={theme}>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="ranking" element={<Ranking species={species} fieldData={fieldData} />} />
					<Route path="species" element={<Species species={species} fieldData={fieldData} />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}

export default App;
