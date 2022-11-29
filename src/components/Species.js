import { Box, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Species = ({ species, fieldData }) => {
	const [selectedSpeciesId, setSelectedSpeciesId] = useState();
	const [bestMethod, setBestMethod] = useState();

	useEffect(() => {
		if (!species || !fieldData || !selectedSpeciesId) {
			return;
		}
		const speciesName = species.find((s) => s.tree_species_id === selectedSpeciesId)?.latin_name;
		// Limit field_data to the selected species only
		const speciesData = fieldData.filter((d) => d.species_id === selectedSpeciesId);
		// Group data by method used
		const methods = speciesData.reduce((acc, curr) => {
			const method = curr.method;
			// method name used as key might not be the best idea but let's roll with it for now
			acc[method] = acc[method] || [];
			acc[method].push(curr);
			return acc;
		}, {});
		const methodScores = [];
		// Calculate average health per method
		for (const key in methods) {
			const healthScore = methods[key].reduce((acc, curr) => {
				try {
					const health = parseInt(curr.health, 10);
					return Number.isInteger(health) ? acc + health : 0;
				} catch {
					return 0;
				}
			}, 0);
			const averageHealth = healthScore / methods[key].length;
			methodScores.push({ method: key, averageHealth });
		}
		// Choose the best method based on average health score
		const highestScore = methodScores.reduce((acc, current) => (acc.averageHealth > current.averageHealth ? acc : current), []);
		setBestMethod({
			tree_species_id: selectedSpeciesId,
			tree_species_latin_name: speciesName,
			best_method: highestScore.method,
			health_average: highestScore.averageHealth?.toFixed(2),
			seen_in: methods[highestScore.method],
		});
	}, [selectedSpeciesId, fieldData, species]);

	return (
		<Box m="12">
			<Select placeholder="Select species" value={selectedSpeciesId} onChange={(e) => setSelectedSpeciesId(e.target.value)}>
				{species?.map((s) => (
					<option key={s.tree_species_id} value={s.tree_species_id}>
						{s.latin_name}
					</option>
				))}
			</Select>
			{!!bestMethod?.best_method ? (
				<Box mt="2">
					{bestMethod.best_method}: {bestMethod.health_average}
				</Box>
			) : selectedSpeciesId ? (
				'Not enough data'
			) : null}
		</Box>
	);
};

export default Species;
