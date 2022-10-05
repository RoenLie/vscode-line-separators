import * as vscode from 'vscode';

export const devExample = ( activeEditor: vscode.TextEditor ) => {
	activeEditor.edit( ( editbuilder ) => {
		editbuilder.insert( new vscode.Position( 0, 0 ), `

import test from 'path'


// Test
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