import * as vscode from 'vscode';

export const devExample = ( activeEditor: vscode.TextEditor ) => {
	activeEditor.edit( ( editbuilder ) => {
		editbuilder.insert( new vscode.Position( 0, 0 ), `
import test from 'path'


class Tester {

	public NEi() {
	}

	public tester = () => {

	}

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