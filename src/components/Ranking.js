import { useEffect, useState } from 'react';
import { Box, Select } from '@chakra-ui/react';
import parseCsv from '../util/parseCsv';

const Ranking = () => {
	const [species, setSpecies] = useState([]);
	const [fieldData, setFieldData] = useState([]);
	const [availableYears, setAvailableYears] = useState([]);
	const [year, setYear] = useState();
	const [dataPerYear, setDataPerYear] = useState();

	useEffect(() => {
		// TODO error handle (no file in /data, invalid format etc)
		Promise.all([fetch('./data/species.csv'), fetch('./data/field_data.csv')])
			.then(([s, d]) => Promise.all([s.text(), d.text()]))
			.then(([s, d]) => {
				setSpecies(parseCsv(s));
				const parsedFieldData = parseCsv(d, ';');
				setFieldData(parsedFieldData);
				const uniqueYears = [...new Set(parsedFieldData.map((d) => d.year_monitored))];
				setAvailableYears(uniqueYears); // could add sorting here
				if (uniqueYears.length > 0) {
					// pre-select the most recent year
					setYear(uniqueYears[uniqueYears.length - 1]);
				}
			});
	}, []);

	useEffect(() => {
		if (!year || !fieldData?.length) {
			return;
		}
		const sortedByYear = fieldData.filter((d) => d.year_monitored === year).sort((a, b) => b.height - a.height);
		if (sortedByYear.length > 0) {
			setDataPerYear(sortedByYear.slice(0, 5));
		}
	}, [year, fieldData]);

	return (
		<Box m="12">
			<Select placeholder="Select year" value={year} onChange={(e) => setYear(e.target.value)}>
				{availableYears?.map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</Select>
			{(dataPerYear?.length ?? 0) > 0 && (
				<Box mt="8">
					{dataPerYear.map((d) => {
						const speciesName = species?.find((s) => s.tree_species_id === d.species_id);
						return (
							<div key={d.individual_tree_id}>
								{d.individual_tree_id}
								{!!speciesName?.latin_name && ` (${speciesName.latin_name})`}: {d.height}
							</div>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default Ranking;
