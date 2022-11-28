import { Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

const MenuItem = (props) => {
	const { children, isLast, to = '/', ...rest } = props;
	return (
		<Text mr={{ base: 0, sm: isLast ? 0 : 8 }} display="block" {...rest}>
			<Link to={to}>{children}</Link>
		</Text>
	);
};

const Navbar = (props) => {
	return (
		<Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" bg="background.primary" color="font.primary" {...props}>
			<Flex align="center" ml="12">
				<img src={logo} className="App-logo" alt="logo" />
			</Flex>
			<Flex align="center" justify="center" direction={['column', 'row', 'row', 'row']} pt={[4, 4, 0, 0]} mr="12">
				<MenuItem to="/">Home</MenuItem>
				<MenuItem to="/ranking">Ranking</MenuItem>
				<MenuItem to="/species">Species</MenuItem>
			</Flex>
		</Flex>
	);
};

export default Navbar;
