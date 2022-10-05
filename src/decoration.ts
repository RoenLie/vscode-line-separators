/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import {
	window, ThemeColor, TextEditor, Range, TextEditorDecorationType,
	DecorationRenderOptions, DocumentSymbol, workspace
} from "vscode";
import { DEFAULT_GREENISH_COLOR } from "./constants";
import { CustomDocumentSymbol } from './symbols.js';

export const createTopLineDecoration = (
	borderColor: string | ThemeColor,
	borderWidth: string,
	borderStyle: string
): TextEditorDecorationType => {
	const decorationOptions: DecorationRenderOptions = {
		isWholeLine: true,
		borderWidth: `0 0 ${ borderWidth } 0`,
		borderStyle: `${ borderStyle }`,
		borderColor: borderColor,
	};

	return window.createTextEditorDecorationType( decorationOptions );
};

const useOriginalGreenishSeparator = ( symbolKind: string ): boolean => {
	if ( ![ "methods", "functions", "constructors" ].includes( symbolKind ) )
		return false;

	return workspace.getConfiguration( "separators" ).get( "useOriginalGreenishSeparator", false );
};

const getBorderColor = ( symbolKind: string ): string | ThemeColor => {
	if ( useOriginalGreenishSeparator( symbolKind ) )
		return DEFAULT_GREENISH_COLOR;

	return new ThemeColor( `separators.${ symbolKind }.borderColor` );
};

export const createTextEditorDecoration = ( symbolKind: string ): TextEditorDecorationType => {
	const borderColor = getBorderColor( symbolKind );
	const borderWidth = workspace.getConfiguration( "separators" ).get( `${ symbolKind }.borderWidth`, 1 );
	const borderStyle = workspace.getConfiguration( "separators" ).get( `${ symbolKind }.borderStyle`, "solid" );

	return createTopLineDecoration( borderColor, `${ borderWidth }px`, borderStyle );
};

export const updateDecorationsInActiveEditor = (
	activeEditor: TextEditor | undefined,
	symbols: DocumentSymbol[] | CustomDocumentSymbol[] | undefined,
	decorationType: TextEditorDecorationType
) => {
	if ( !activeEditor )
		return;

	if ( !symbols ) {
		const bks: Range[] = [];
		activeEditor.setDecorations( decorationType, bks );
		return;
	}

	//TODO if the immediate lines above are comments, move the starting point to the first non comment line
	const ranges: Range[] = [];

	for ( const element of symbols ) {
		let freeLines = 0;
		let lineToCheck = element.range.start.line - 1;

		while ( lineToCheck > 0 && !window.activeTextEditor.document.getText(
			new Range( lineToCheck, 0, lineToCheck, 10 )
		).replace( / |\t/g, '' ) ) {
			freeLines++;
			lineToCheck--;
		}

		if ( freeLines <= 1 )
			continue;

		freeLines = Math.max( Math.min( 2, freeLines ), 1 );

		const desiredRange = new Range(
			element.range.start.line - freeLines, 0,
			element.range.start.line - freeLines, 0
		);

		ranges.push( desiredRange );
	}

	activeEditor.setDecorations( decorationType, ranges );
};

export const updateCustomSymbolDecorationInActiveEditor = (
	activeEditor: TextEditor | undefined,
	customSymbols: CustomDocumentSymbol[],
	decorationType: TextEditorDecorationType
) => {
	if ( !activeEditor )
		return;

	const desiredRanges: Range[] = [];

	for ( const symbol of customSymbols ) {
		let freeLines = 0;
		let lineToCheck = symbol.range.start.line - 1;

		while ( lineToCheck > 0 && !window.activeTextEditor.document.getText(
			new Range( lineToCheck, 0, lineToCheck, 10 )
		).replace( / |\t/g, '' ) ) {
			freeLines++;
			lineToCheck--;
		}

		if ( freeLines <= 1 )
			continue;

		freeLines = Math.max( Math.min( 2, freeLines ), 1 );

		const desiredRange = new Range(
			symbol.range.start.line - freeLines, 0,
			symbol.range.start.line - freeLines, 0
		);

		desiredRanges.push( desiredRange );
	}

	activeEditor.setDecorations( decorationType, desiredRanges );
};