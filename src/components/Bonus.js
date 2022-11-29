import { Box, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: 'Average height per species',
		},
	},
	scales: {
		y: {
			ticks: {
				beginAtZero: true,
			},
		},
	},
};

const Bonus = ({ species, fieldData }) => {
	const [methods, setMethods] = useState();
	const [selectedMethod, setSelectedMethod] = useState();
	const [chartData, setChartData] = useState();

	useEffect(() => {
		if (!fieldData?.length) {
			return;
		}
		const uniqueMethods = [...new Set(fieldData.map((d) => d.method))];
		setMethods(uniqueMethods);
	}, [fieldData]);

	useEffect(() => {
		if (!selectedMethod || !fieldData?.length || !species?.length) {
			setChartData(undefined);
			return;
		}
		// Limit field_data to the selected method only
		const methodData = fieldData.filter((d) => d.method === selectedMethod);
		// Group data by species
		const speciesData = methodData.reduce((acc, curr) => {
			const speciesId = curr.species_id;
			acc[speciesId] = acc[speciesId] || [];
			acc[speciesId].push(curr);
			return acc;
		}, {});
		// Calculate average height per method and species
		const averageHeights = [];
		for (const key in speciesData) {
			const totalHeight = speciesData[key].reduce((acc, curr) => {
				try {
					const height = parseInt(curr.height, 10);
					return Number.isInteger(height) ? acc + height : 0;
				} catch {
					return 0;
				}
			}, 0);
			const averageHeight = totalHeight / speciesData[key].length;
			averageHeights.push({ speciesId: key, averageHeight });
		}
		setChartData({
			labels: averageHeights?.map((h) => species.find((s) => s.tree_species_id === h.speciesId)?.latin_name) ?? [],
			datasets: [
				{
					label: 'Average height',
					data: averageHeights?.map((h) => h.averageHeight?.toFixed(2)) ?? [],
					backgroundColor: '#496c50',
				},
			],
		});
	}, [selectedMethod, fieldData, species]);

	return (
		<Box m="12">
			<p>This screen shows a graph plotting the average height (taking into account all the years present in the data) for each species.</p>
			<Select placeholder="Select method" value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} mt="2">
				{methods?.map((m) => (
					<option key={m} value={m}>
						{m}
					</option>
				))}
			</Select>
			{!!chartData && (
				<Box style={{ height: '300px' }}>
					<Bar options={options} data={chartData} />
				</Box>
			)}
		</Box>
	);
};

export default Bonus;
