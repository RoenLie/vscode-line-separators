import * as vscode from 'vscode';

export const devExample = ( activeEditor: vscode.TextEditor ) => {
	activeEditor.edit( ( editbuilder ) => {
		editbuilder.insert( new vscode.Position( 0, 0 ), `

import test from 'path'

/**
 * @slot        - The card's body.
 * @slot header - The card's header.
 * @slot footer - The card's footer.
 * @slot image  - The card's image.
 *
 * @csspart base   - The component's internal wrapper.
 * @csspart image  - The card's image, if present.
 * @csspart header - The card's header, if present.
 * @csspart body   - The card's body.
 * @csspart footer - The card's footer, if present.
 *
 * @cssproperty --border-color  - The card's border color, including borders that occur inside the card.
 * @cssproperty --border-radius - The border radius for card edges.
 * @cssproperty --border-width  - The width of card borders.
 * @cssproperty --padding       - The padding to use for card sections.*
 */
class Tester {

	//#region First region
	public NEi() {
	}
	//#endregion


	//#region Second region
	public tester = () => {

	}
	//#endregion

}


const Kakemann = () => {

}


function mannen() {

}


interface TesterInter {

}


type TesterType = string;

		`);
	} );
};