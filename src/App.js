import './App.css';
import { extendTheme, Box, ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Ranking from './components/Ranking';
import Species from './components/Species';
import parseCsv from './util/parseCsv';
import Bonus from './components/Bonus';

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

const Home = () => (
	<Box m="8" p="12">
		Rough frontend drafted for the assignment. This is NOT how I would write code in a production app. If I understand the assignment correctly, the
		point was to create a POC within a limited time. Normally I'd use TypeScript and create models and types. I'd make sure the page is actually
		designed nicely. There would be backend providing the data and frontend could focus on the UX.
	</Box>
);

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
					<Route path="bonus" element={<Bonus species={species} fieldData={fieldData} />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}

export default App;
