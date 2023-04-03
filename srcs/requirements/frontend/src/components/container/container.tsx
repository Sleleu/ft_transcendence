import { CSSProperties, Component } from 'react';

interface Props {
	width?: string;
	height?: string;
	padding?: string;
	backgroundColor?: string;
	borderRadius?: string;
	children?: React.ReactNode;
}

class Cont extends Component<Props> {
	render() {
		const {backgroundColor, padding, width, height, borderRadius, children} = this.props;

		const ContStyle: CSSProperties = {
			backgroundColor: backgroundColor ? backgroundColor : 'black',
			padding: padding ? padding : '5px',
    		opacity: 0.75,
    		width: width ? width : '679px',
   			height: height ? height : '425px',
    		borderRadius: borderRadius ? borderRadius : '15px',
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-start"
		}
		return (
			<div style={ContStyle}> {children}</div>
		);
	}
}

class HeaderBar extends Component<Props> {
	render() {
		const {backgroundColor, padding, width, height, borderRadius, children} = this.props;

		const HeaderStyle: CSSProperties = {
			backgroundColor: backgroundColor ? backgroundColor : 'black',
			padding: padding ? padding : '5px',
    		opacity: 0.75,
    		width: width ? width : '679px',
   			height: height ? height : '70px',
    		borderRadius: borderRadius ? borderRadius : '15px',
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-start"
		}
		return (
			<div style={HeaderStyle}> {children}</div>
		);
	}
}

export {Cont, HeaderBar};